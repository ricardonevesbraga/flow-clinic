# 🔧 Correção do Erro "Invalid JWT" - SOLUÇÃO DEFINITIVA

## ✅ Correções Aplicadas

### 1. **Configuração (`supabase/config.toml`)**
- ✅ **DESABILITADA** a verificação JWT automática do Supabase
- ✅ Configurado `verify_jwt = false` para a função `create-organization`
- ✅ Isso permite que a função receba a requisição e faça validação manual

### 2. **Edge Function (`supabase/functions/create-organization/index.ts`)**
- ✅ Agora usa **anon key** (do header `apikey`) para validar o token do usuário
- ✅ Cria um cliente separado com anon key para validação
- ✅ Retorna erros HTTP apropriados (401) em vez de lançar exceções
- ✅ Melhor tratamento de erros com mensagens detalhadas
- ✅ Logs mais detalhados para debug

### 3. **Frontend (`src/pages/super-admin/OrganizationForm.tsx`)**
- ✅ Já está enviando o header `apikey` corretamente
- ✅ Verifica se a sessão está válida antes de fazer a chamada

## 🚀 Como Fazer o Deploy (OBRIGATÓRIO)

⚠️ **IMPORTANTE:** Você DEVE fazer o deploy novamente para aplicar as correções!

### Opção 1: Via Supabase CLI (Recomendado)

```bash
# 1. Certifique-se de estar no diretório do projeto
cd "/Users/ricneves/Downloads/clinica - flowgrammers/flowclinic"

# 2. Fazer deploy da função (isso aplica o config.toml também)
supabase functions deploy create-organization

# 3. Se pedir login:
supabase login

# 4. Se pedir link do projeto:
supabase link --project-ref usidtjpjymomofyqolwe

# 5. Verificar se o deploy foi bem-sucedido
supabase functions list
```

### Opção 2: Via Dashboard do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Edge Functions** > **create-organization**
3. **IMPORTANTE:** Vá em **Settings** e desative **"Verify JWT"** ou **"Verify JWT with legacy secret"**
4. Cole o código atualizado de `supabase/functions/create-organization/index.ts`
5. Clique em **Deploy**

### Opção 2: Via Dashboard do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Edge Functions** > **create-organization**
3. Cole o código atualizado de `supabase/functions/create-organization/index.ts`
4. Clique em **Deploy**

## 🔍 Verificação

Após o deploy:

1. **Teste a função novamente** criando uma organização
2. **Verifique os logs** no Supabase Dashboard:
   - Vá em **Edge Functions** > **create-organization** > **Logs**
   - Procure por mensagens como:
     - `🔑 Authorization header presente: true`
     - `🔑 Apikey header presente: true`
     - `✅ Usuário autenticado: <user-id>`

## ⚠️ Se o Erro Persistir

1. **Verifique se a sessão está válida:**
   - Faça logout e login novamente
   - Verifique se o token não expirou

2. **Verifique as variáveis de ambiente:**
   - Certifique-se de que `VITE_SUPABASE_PUBLISHABLE_KEY` está configurada no `.env`
   - Verifique se o valor está correto

3. **Verifique os logs da Edge Function:**
   - Os logs mostrarão exatamente onde está falhando
   - Procure por mensagens de erro detalhadas

4. **Teste manualmente a função:**
   ```bash
   curl -X POST https://usidtjpjymomofyqolwe.supabase.co/functions/v1/create-organization \
     -H "Authorization: Bearer <seu-token>" \
     -H "apikey: <sua-anon-key>" \
     -H "Content-Type: application/json" \
     -d '{"organizationName":"Teste","adminEmail":"test@test.com","adminPassword":"test123","adminFullName":"Test User"}'
   ```

## 📝 Mudanças Técnicas

### Antes:
- Supabase validava JWT automaticamente ANTES de chegar na função (causava 401)
- Usava Service Role Key para validar token (não funciona corretamente)
- Lançava exceções em vez de retornar respostas HTTP apropriadas

### Depois:
- **Desabilitada** verificação JWT automática do Supabase (`verify_jwt = false`)
- Usa **anon key** (do header `apikey`) para validar o token manualmente
- Cria cliente separado para validação
- Retorna respostas HTTP apropriadas (401 para não autenticado)
- Melhor tratamento de erros com logs detalhados

## ⚠️ Por Que Isso Resolve?

O problema era que o **Supabase estava validando o JWT ANTES** de chegar no código da função. Mesmo com um JWT válido, o Supabase retornava 401 automaticamente.

Com `verify_jwt = false`, o Supabase **não valida automaticamente**, permitindo que nossa função receba a requisição e faça a validação manualmente usando a anon key, que funciona corretamente.

