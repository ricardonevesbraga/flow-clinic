import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Função para obter headers CORS baseado na origem
const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];
  
  const originHeader = origin && allowedOrigins.includes(origin) ? origin : '*';
  
  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    console.log('🚀 Iniciando create-organization Edge Function...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Verificar se usuário logado é super admin
    const authHeader = req.headers.get('Authorization')
    const apikeyHeader = req.headers.get('apikey')
    
    console.log('🔑 Authorization header presente:', !!authHeader);
    console.log('🔑 Apikey header presente:', !!apikeyHeader);
    console.log('🔑 Supabase URL:', supabaseUrl);
    console.log('🔑 Service Key presente:', !!supabaseServiceKey);
    
    if (!authHeader) {
      console.error('❌ Nenhum header de autorização encontrado');
      return new Response(
        JSON.stringify({ error: 'Não autenticado: header Authorization ausente' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }
    
    // Extrair token do header
    const token = authHeader.replace('Bearer ', '').trim();
    console.log('🔑 Token extraído (primeiros 30 chars):', token.substring(0, 30) + '...');
    
    // Usar anon key do header ou variável de ambiente (OBRIGATÓRIO)
    const apikey = apikeyHeader || Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!apikey) {
      console.error('❌ Anon key não encontrada - necessário para validar token');
      return new Response(
        JSON.stringify({ 
          error: 'Configuração inválida: anon key não encontrada',
          hint: 'Certifique-se de enviar o header "apikey" ou configurar SUPABASE_ANON_KEY'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
    // SEMPRE usar anon key para validar token (mais confiável)
    console.log('🔑 Validando token com anon key...');
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
    
    // Validar token usando anon key
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    console.log('👤 Resultado getUser - user:', user?.id);
    console.log('👤 Resultado getUser - error:', userError);
    
    if (userError) {
      console.error('❌ Erro ao verificar usuário:', userError);
      console.error('❌ Tipo do erro:', userError.name);
      console.error('❌ Mensagem do erro:', userError.message);
      console.error('❌ Status do erro:', userError.status);
      
      // Se o erro for de JWT inválido, dar dica sobre verificação JWT
      if (userError.message?.includes('JWT') || userError.message?.includes('Invalid')) {
        return new Response(
          JSON.stringify({ 
            error: 'Token inválido ou expirado',
            details: userError.message,
            hint: 'Verifique se a opção "Verify JWT" está DESATIVADA nas configurações da função no Supabase Dashboard',
            code: 401
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Token inválido ou expirado',
          details: userError.message,
          code: 401
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
        JSON.stringify({ 
          error: 'Token inválido: usuário não encontrado',
          hint: 'O token pode estar expirado. Faça logout e login novamente.'
        }),
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
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (createUserError) {
      console.error('❌ Erro ao criar usuário:', createUserError)
      throw createUserError
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
