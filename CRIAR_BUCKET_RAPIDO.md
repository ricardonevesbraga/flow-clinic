# 🚀 Criar Bucket Rápido - 2 Minutos

## ⚠️ Erro: "Bucket not found"

Se você está vendo este erro, o bucket `organization-logos` não existe ainda.

## ✅ Solução Rápida (2 minutos):

### Passo 1: Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto (usidtjpjymomofyqolwe ou detsacgocmirxkgjusdf)

### Passo 2: Criar o Bucket
1. No menu lateral, clique em **Storage**
2. Clique em **"New Bucket"** ou **"Create a new bucket"**
3. Preencha:
   - **Name**: `organization-logos` (EXATO, sem espaços)
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (obrigatório!)
   - **File size limit**: `2097152` (2 MB) - opcional
   - **Allowed MIME types**: `image/*` - opcional
4. Clique em **"Create bucket"**

### Passo 3: Verificar
- Você deve ver o bucket `organization-logos` na lista
- Status deve mostrar **"Public"**

### Passo 4: Testar
- Volte para a aplicação
- Tente fazer upload do logo novamente
- Deve funcionar agora! ✅

## 📝 Configuração Recomendada:

```
Nome: organization-logos
Public: ✅ SIM (marcado)
File size limit: 2097152 (2 MB)
Allowed MIME types: image/*
```

## 🔍 Se Ainda Der Erro:

1. **Verifique o nome:**
   - Deve ser exatamente: `organization-logos`
   - Sem espaços, sem maiúsculas

2. **Verifique se é público:**
   - Deve estar marcado como "Public bucket"
   - Se não estiver, edite o bucket e marque

3. **Verifique as permissões:**
   - O bucket deve estar acessível
   - Verifique se você está logado como super admin

## 💡 Dica:

O código agora detecta automaticamente se o bucket não existe e mostra uma mensagem clara com instruções. Se você seguir as instruções na mensagem de erro, o problema será resolvido!

