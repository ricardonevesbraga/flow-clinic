# 🚀 Deploy Manual da Edge Function

## Passo a Passo para Fazer o Deploy

### 1. Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **usidtjpjymomofyqolwe**

### 2. Acesse Edge Functions
1. No menu lateral, clique em **Edge Functions**
2. Procure pela função **create-organization**
3. Clique nela para abrir

### 3. Desative a Verificação JWT (IMPORTANTE!)
1. Na página da função, procure por **Settings** ou **Configurações**
2. Procure pela opção **"Verify JWT"** ou **"Verify JWT with legacy secret"**
3. **DESATIVE** essa opção (deixe desmarcada)
4. Isso é essencial para que a função funcione corretamente!

### 4. Atualize o Código
1. Clique em **Edit** ou **Editar**
2. Abra o arquivo: `supabase/functions/create-organization/index.ts`
3. **Copie TODO o conteúdo** do arquivo
4. **Cole** no editor do Dashboard
5. Clique em **Save** ou **Salvar**

### 5. Faça o Deploy
1. Clique no botão **Deploy** ou **Publicar**
2. Aguarde o deploy ser concluído
3. Você verá uma mensagem de sucesso

### 6. Verifique o Deploy
1. Teste criando uma organização no sistema
2. Se ainda der erro, verifique os logs:
   - Vá em **Edge Functions** > **create-organization** > **Logs**
   - Procure por mensagens de erro

## ✅ Checklist

- [ ] Acessei o Supabase Dashboard
- [ ] Encontrei a função create-organization
- [ ] **DESATIVEI** a verificação JWT nas configurações
- [ ] Copiei o código atualizado
- [ ] Colei no editor
- [ ] Fiz o deploy
- [ ] Testei criando uma organização

## 🔍 Se Ainda Der Erro

1. Verifique os logs da função no Dashboard
2. Certifique-se de que a verificação JWT está DESATIVADA
3. Verifique se o código foi salvo corretamente
4. Tente fazer o deploy novamente

## 📝 Nota

O arquivo `supabase/config.toml` já está configurado com `verify_jwt = false`, mas isso só funciona se você fizer deploy via CLI. Como estamos fazendo via Dashboard, é necessário desativar manualmente nas configurações da função.

