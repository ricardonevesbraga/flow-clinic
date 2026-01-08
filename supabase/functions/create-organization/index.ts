import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Iniciando create-organization Edge Function...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Pegar anon key do header apikey (enviado pelo cliente) ou variável de ambiente
    const apikey = req.headers.get('apikey') || Deno.env.get('SUPABASE_ANON_KEY') || '';

    // Verificar se usuário logado é super admin
    const authHeader = req.headers.get('Authorization')
    console.log('🔑 Authorization header presente:', !!authHeader);
    console.log('🔑 Apikey header presente:', !!req.headers.get('apikey'));
    
    if (!authHeader) {
      console.error('❌ Nenhum header de autorização encontrado');
      return new Response(
        JSON.stringify({ error: 'Não autenticado' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }
    
    if (!apikey) {
      console.error('❌ Anon key não encontrada');
      return new Response(
        JSON.stringify({ error: 'Chave de API não configurada' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
    // Criar cliente com anon key para validar o token do usuário
    const supabaseClient = createClient(supabaseUrl, apikey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Validar token do usuário usando anon key
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    console.log('👤 Resultado getUser - user:', user?.id);
    console.log('👤 Resultado getUser - error:', userError);
    
    if (userError) {
      console.error('❌ Erro ao verificar usuário:', userError);
      console.error('❌ Detalhes do erro:', JSON.stringify(userError, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'Token inválido ou expirado',
          details: userError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }
    
    if (!user) {
      console.error('❌ Usuário não encontrado no token');
      return new Response(
        JSON.stringify({ error: 'Token inválido: usuário não encontrado' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    console.log('✅ Usuário autenticado:', user.id);

    // Criar cliente Supabase com Service Role (admin) para operações administrativas
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar se é super admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single()

    console.log('👤 Profile encontrado:', profile);
    console.log('👤 Profile error:', profileError);
    console.log('👤 Is super admin:', profile?.is_super_admin);

    if (!profile || !profile.is_super_admin) {
      console.error('❌ Usuário não é super admin');
      throw new Error('Apenas super admins podem criar organizações')
    }
    
    console.log('✅ Verificação de super admin OK');

    // Pegar dados do request
    const { 
      organizationName, 
      adminEmail, 
      adminPassword, 
      adminFullName,
      isActive = true,
      subscriptionPlan = 'plano_a'
    } = await req.json()

    console.log('📋 Criando organização:', organizationName)

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError)
      throw authError
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário')
    }

    console.log('✅ Usuário criado:', authData.user.id)

    // 2. Gerar slug
    const slug = organizationName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now()

    console.log('📝 Slug gerado:', slug)

    // 3. Criar organização
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: organizationName,
        slug,
        is_active: isActive,
        subscription_plan: subscriptionPlan,
      })
      .select()
      .single()

    if (orgError) {
      console.error('❌ Erro ao criar organização:', orgError)
      // Limpar: deletar usuário criado
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw orgError
    }

    console.log('✅ Organização criada:', orgData.id)

    // 4. Criar perfil do admin
    const { error: profileInsertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        organization_id: orgData.id,
        full_name: adminFullName,
        role: 'admin',
        is_super_admin: false,
        is_active: true,
      })

    if (profileInsertError) {
      console.error('❌ Erro ao criar perfil:', profileInsertError)
      // Limpar: deletar organização e usuário
      await supabaseAdmin.from('organizations').delete().eq('id', orgData.id)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw profileInsertError
    }

    console.log('✅ Perfil criado')

    // 5. Criar settings padrão
    const { error: settingsError } = await supabaseAdmin
      .from('settings')
      .insert({
        organization_id: orgData.id,
        clinic_name: organizationName,
        doctor_name: adminFullName,
        subscription_plan: 'premium',
      })

    if (settingsError) {
      console.error('❌ Erro ao criar settings:', settingsError)
      // Limpar: deletar tudo
      await supabaseAdmin.from('profiles').delete().eq('id', authData.user.id)
      await supabaseAdmin.from('organizations').delete().eq('id', orgData.id)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw settingsError
    }

    console.log('✅ Settings criadas')
    console.log('🎉 Organização criada com sucesso!')

    return new Response(
      JSON.stringify({
        success: true,
        organization: orgData,
        admin: {
          id: authData.user.id,
          email: adminEmail,
          full_name: adminFullName,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Erro ao criar organização',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
