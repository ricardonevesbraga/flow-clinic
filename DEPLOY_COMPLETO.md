# 🚀 Deploy Completo da Aplicação

## ✅ Status do Build

- ✅ **Frontend buildado com sucesso!**
- 📦 Arquivos gerados em: `dist/`
- 📊 Tamanho: ~897 KB (JS) + 90 KB (CSS)

## 📋 Deploy da Aplicação Frontend

### Opção 1: Vercel (Recomendado)

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Fazer deploy:**
   ```bash
   vercel
   ```

3. **Ou via Dashboard:**
   - Acesse: https://vercel.com
   - Conecte seu repositório GitHub
   - Configure:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

### Opção 2: Netlify

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Fazer deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Ou via Dashboard:**
   - Acesse: https://app.netlify.com
   - Arraste a pasta `dist` ou conecte o repositório

### Opção 3: GitHub Pages

1. Instale `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Adicione ao `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. Execute:
   ```bash
   npm run deploy
   ```

## 🔧 Deploy das Edge Functions (SUPABASE)

### ⚠️ IMPORTANTE: Deploy Manual Necessário

Como o Supabase CLI requer autenticação interativa, você precisa fazer o deploy manualmente:

### Passo a Passo:

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Projeto: **usidtjpjymomofyqolwe**

2. **Para cada Edge Function:**

   #### create-organization
   - Vá em **Edge Functions** > **create-organization**
   - **Settings** > Desative **"Verify JWT"**
   - **Edit** > Cole o código de `supabase/functions/create-organization/index.ts`
   - Clique em **Deploy**

   #### manage-organization-users
   - Vá em **Edge Functions** > **manage-organization-users**
   - **Settings** > Desative **"Verify JWT"**
   - **Edit** > Cole o código de `supabase/functions/manage-organization-users/index.ts`
   - Clique em **Deploy**

   #### update-organization
   - Vá em **Edge Functions** > **update-organization**
   - **Settings** > Desative **"Verify JWT"**
   - **Edit** > Cole o código de `supabase/functions/update-organization/index.ts`
   - Clique em **Deploy**

## 📝 Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis no seu provedor de deploy:

```
VITE_SUPABASE_URL=https://usidtjpjymomofyqolwe.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_aqui
VITE_SUPABASE_PROJECT_ID=usidtjpjymomofyqolwe
VITE_N8N_WEBHOOK_URL=https://webhook.agentes-n8n.com.br/webhook/
```

## ✅ Checklist de Deploy

### Frontend:
- [ ] Build executado com sucesso (`npm run build`)
- [ ] Pasta `dist/` gerada
- [ ] Deploy feito (Vercel/Netlify/GitHub Pages)
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação acessível e funcionando

### Edge Functions:
- [ ] `create-organization` deployada
- [ ] `manage-organization-users` deployada
- [ ] `update-organization` deployada
- [ ] Verificação JWT desativada em todas
- [ ] Código atualizado em todas

## 🧪 Testes Pós-Deploy

1. **Teste de Login:**
   - Acesse a aplicação
   - Faça login com um usuário super admin
   - Verifique se o dashboard carrega

2. **Teste de Criação de Organização:**
   - Vá em Super Admin > Organizações
   - Clique em "Nova Organização"
   - Preencha o formulário
   - Clique em "Criar"
   - Verifique se não há erro de JWT

3. **Verifique os Logs:**
   - Supabase Dashboard > Edge Functions > Logs
   - Procure por erros ou avisos

## 🔍 Troubleshooting

### Erro "Invalid JWT":
- Verifique se a verificação JWT está DESATIVADA nas configurações da função
- Verifique se o código foi atualizado corretamente
- Verifique os logs da função

### Erro de Build:
- Execute `npm install` novamente
- Limpe o cache: `rm -rf node_modules dist`
- Execute `npm run build` novamente

### Erro de Variáveis de Ambiente:
- Verifique se todas as variáveis estão configuradas
- Verifique se os valores estão corretos
- Reinicie o servidor após configurar

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase Dashboard
2. Verifique o console do navegador
3. Verifique os logs do provedor de deploy

