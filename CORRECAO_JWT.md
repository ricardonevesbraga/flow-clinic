# 🔧 Correção do Erro "Invalid JWT"

## ✅ Correções Aplicadas

### 1. **Edge Function (`supabase/functions/create-organization/index.ts`)**
- ✅ Agora usa **anon key** (do header `apikey`) para validar o token do usuário
- ✅ Cria um cliente separado com anon key para validação
- ✅ Retorna erros HTTP apropriados (401) em vez de lançar exceções
- ✅ Melhor tratamento de erros com mensagens detalhadas

### 2. **Frontend (`src/pages/super-admin/OrganizationForm.tsx`)**
- ✅ Já está enviando o header `apikey` corretamente
- ✅ Verifica se a sessão está válida antes de fazer a chamada

## 🚀 Como Fazer o Deploy

### Opção 1: Via Supabase CLI (Recomendado)

```bash
# 1. Certifique-se de estar no diretório do projeto
cd "/Users/ricneves/Downloads/clinica - flowgrammers/luxclinic-concierge"

# 2. Fazer deploy da função
supabase functions deploy create-organization

# 3. Se pedir login:
supabase login

# 4. Se pedir link do projeto:
supabase link --project-ref usidtjpjymomofyqolwe
```

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
- Usava Service Role Key para validar token (não funciona corretamente)
- Lançava exceções em vez de retornar respostas HTTP apropriadas

### Depois:
- Usa **anon key** (do header `apikey`) para validar o token
- Cria cliente separado para validação
- Retorna respostas HTTP apropriadas (401 para não autenticado)
- Melhor tratamento de erros

