# 🔧 SOLUÇÃO FINAL - Erro "Invalid JWT"

## ⚠️ PROBLEMA

O erro "Invalid JWT" está acontecendo porque o **Supabase está validando o JWT ANTES** de chegar no código da função. Isso acontece quando a opção "Verify JWT" está **ATIVADA** no Dashboard.

## ✅ SOLUÇÃO DEFINITIVA

### Passo 1: Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto: **usidtjpjymomofyqolwe**

### Passo 2: Desative a Verificação JWT (CRÍTICO!)

**IMPORTANTE:** Este é o passo MAIS IMPORTANTE! Sem isso, nada funcionará!

1. Vá em **Edge Functions** (menu lateral)
2. Clique na função **create-organization**
3. Procure por **Settings** ou **Configurações** (geralmente no topo ou no menu lateral)
4. Procure pela opção:
   - **"Verify JWT"** OU
   - **"Verify JWT with legacy secret"** OU
   - **"JWT Verification"**
5. **DESATIVE/DESMARQUE** essa opção
6. **SALVE** as configurações

### Passo 3: Atualize o Código da Função

1. Ainda na página da função **create-organization**
2. Clique em **Edit** ou **Editar**
3. **COPIE TODO O CÓDIGO** do arquivo: `supabase/functions/create-organization/index.ts`
4. **COLE** no editor do Dashboard
5. Clique em **Save** ou **Salvar**

### Passo 4: Faça o Deploy

1. Clique no botão **Deploy** ou **Publicar**
2. Aguarde o deploy ser concluído
3. Você verá uma mensagem de sucesso

### Passo 5: Teste

1. Volte para sua aplicação
2. Tente criar uma organização novamente
3. O erro "Invalid JWT" deve ter desaparecido!

## 🔍 Como Verificar se Está Correto

### Verificação 1: Settings da Função
- ✅ "Verify JWT" está **DESATIVADO/DESMARCADO**
- ✅ Configurações foram **SALVAS**

### Verificação 2: Código da Função
- ✅ Código foi **ATUALIZADO** com a versão mais recente
- ✅ Deploy foi **CONCLUÍDO** com sucesso

### Verificação 3: Logs
1. Vá em **Edge Functions** > **create-organization** > **Logs**
2. Tente criar uma organização
3. Procure por estas mensagens nos logs:
   - `🚀 Iniciando create-organization Edge Function...`
   - `🔑 Authorization header presente: true`
   - `✅ Usuário autenticado: <user-id>`

Se você ver essas mensagens, está funcionando! ✅

## ❌ Se Ainda Der Erro

### Erro 401 "Invalid JWT"
- **Causa:** Verificação JWT ainda está ATIVADA
- **Solução:** Volte ao Passo 2 e certifique-se de que está DESATIVADA

### Erro "Token inválido ou expirado"
- **Causa:** Token do usuário expirou
- **Solução:** Faça logout e login novamente na aplicação

### Erro "Não autenticado"
- **Causa:** Header Authorization não está sendo enviado
- **Solução:** Verifique o código do frontend (já está correto)

## 📸 Onde Encontrar "Verify JWT" no Dashboard

A opção pode estar em diferentes lugares dependendo da versão do Dashboard:

1. **Na página da função:**
   - Topo da página, ao lado do nome da função
   - Menu de três pontos (⋯) > Settings
   - Aba "Settings" ou "Configurações"

2. **No menu lateral:**
   - Edge Functions > Settings (configurações globais)
   - Depois selecione a função específica

3. **Durante o deploy:**
   - Algumas versões mostram a opção durante o processo de deploy

## 🎯 Resumo Rápido

1. ✅ Dashboard > Edge Functions > create-organization
2. ✅ Settings > **DESATIVAR** "Verify JWT"
3. ✅ Edit > **COLAR** código atualizado
4. ✅ **DEPLOY**
5. ✅ **TESTAR**

## 📝 Nota Técnica

O código da função já está preparado para validar o JWT manualmente usando a anon key. Isso é mais seguro e confiável do que deixar o Supabase validar automaticamente, pois temos controle total sobre o processo de validação.

**O problema NÃO está no código, está na CONFIGURAÇÃO do Dashboard!**

