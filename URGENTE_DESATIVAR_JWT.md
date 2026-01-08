# 🚨 URGENTE - DESATIVE A VERIFICAÇÃO JWT NO DASHBOARD

## ⚠️ O ERRO CONTINUA PORQUE:

O Supabase está validando o JWT **ANTES** de chegar no código da função. Isso acontece quando a opção **"Verify JWT"** está **ATIVADA** no Dashboard.

**O CÓDIGO ESTÁ CORRETO!** O problema é a **CONFIGURAÇÃO** no Dashboard.

## ✅ SOLUÇÃO DEFINITIVA (5 MINUTOS):

### 1. Acesse o Dashboard
- URL: https://supabase.com/dashboard
- Projeto: **usidtjpjymomofyqolwe** (ou **detsacgocmirxkgjusdf**)

### 2. Vá em Edge Functions
- Menu lateral > **Edge Functions**
- Clique em **create-organization**

### 3. DESATIVE "Verify JWT" (CRÍTICO!)

**IMPORTANTE:** Este passo é OBRIGATÓRIO! Sem isso, NADA funcionará!

1. Procure por **Settings** ou **⚙️ Configurações**
2. Procure pela opção:
   - ✅ **"Verify JWT"** → **DESMARQUE/DESATIVE**
   - ✅ **"Verify JWT with legacy secret"** → **DESMARQUE/DESATIVE**
   - ✅ **"JWT Verification"** → **DESMARQUE/DESATIVE**
3. **SALVE** as configurações

### 4. Atualize o Código
1. Clique em **Edit** ou **✏️ Editar**
2. **COPIE TODO** o código de: `supabase/functions/create-organization/index.ts`
3. **COLE** no editor
4. **SALVE**

### 5. Deploy
1. Clique em **Deploy** ou **🚀 Publicar**
2. Aguarde concluir

### 6. Teste
- Tente criar uma organização
- Deve funcionar agora! ✅

## 🔍 ONDE ENCONTRAR "Verify JWT"?

A opção pode estar em diferentes lugares:

### Opção A: Na página da função
- Topo da página, ao lado do nome
- Menu de três pontos (⋯) > Settings
- Aba "Settings" ou "Configurações"

### Opção B: Menu lateral
- Edge Functions > Settings (global)
- Depois selecione a função específica

### Opção C: Durante deploy
- Algumas versões mostram durante o deploy

## 📸 Como Deve Ficar:

```
✅ Verify JWT: [ ] DESMARCADO/DESATIVADO
```

**NÃO DEVE ESTAR:**
```
❌ Verify JWT: [✓] MARCADO/ATIVADO
```

## ⚠️ SE AINDA DER ERRO:

1. **Verifique os logs:**
   - Edge Functions > create-organization > Logs
   - Procure por mensagens de erro

2. **Verifique se salvou:**
   - As configurações foram salvas?
   - O código foi atualizado?

3. **Tente novamente:**
   - Faça logout e login no Dashboard
   - Desative novamente "Verify JWT"
   - Faça deploy novamente

## 🎯 RESUMO RÁPIDO:

1. ✅ Dashboard > Edge Functions > create-organization
2. ✅ Settings > **DESATIVAR** "Verify JWT"
3. ✅ **SALVAR** configurações
4. ✅ Edit > **COLAR** código atualizado
5. ✅ **DEPLOY**
6. ✅ **TESTAR**

## 💡 POR QUE ISSO É NECESSÁRIO?

O Supabase tem uma verificação JWT automática que roda **ANTES** do seu código. Quando ativada, ela valida o JWT e, se falhar, retorna 401 **SEM** executar seu código.

Ao desativar, o Supabase **NÃO valida automaticamente** e deixa seu código fazer a validação manualmente (que está implementada e funcionando).

**O CÓDIGO JÁ ESTÁ PRONTO! Só precisa desativar a verificação automática!**

