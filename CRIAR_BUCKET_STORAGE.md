# 📦 Criar Bucket de Storage para Logos

## 🎯 Objetivo

Criar um bucket no Supabase Storage para armazenar os logos das organizações.

---

## 📋 Instruções

### 1. Acessar Supabase Storage

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: **usidtjpjymomofyqolwe**
3. No menu lateral, clique em **Storage**

### 2. Criar Novo Bucket

1. Clique em **"Create a new bucket"** ou **"New Bucket"**
2. Preencha os campos:
   - **Name**: `organization-logos`
   - **Public bucket**: ✅ **Marque esta opção** (logos precisam ser públicos)
   - **File size limit**: 2 MB (recomendado)
   - **Allowed MIME types**: `image/*` (apenas imagens)

3. Clique em **"Create bucket"**

### 3. Configurar Policies (Opcional)

O bucket já é público, mas você pode adicionar policies específicas se quiser:

```sql
-- Policy: Super admins podem fazer upload
CREATE POLICY "Super admins can upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'organization-logos' AND
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_super_admin = true
  ))
);

-- Policy: Super admins podem deletar logos
CREATE POLICY "Super admins can delete logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'organization-logos' AND
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_super_admin = true
  ))
);

-- Policy: Todos podem ver logos (público)
CREATE POLICY "Anyone can view logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'organization-logos');
```

---

## ✅ Verificação

Após criar o bucket, você deve ver:

1. Bucket **organization-logos** listado em Storage
2. Status: **Public**
3. Pronto para receber uploads

---

## 🧪 Testar

1. Faça login como **Super Admin**
2. Vá em **Organizações** > Clique em uma organização
3. Clique em **"Editar"**
4. Na seção **"Logo da Organização"**, faça upload de uma imagem
5. Clique em **"Atualizar"**
6. Verifique se o logo aparece no painel da organização

---

## 📝 Formato de URL

Os logos serão armazenados com URLs no formato:

```
https://usidtjpjymomofyqolwe.supabase.co/storage/v1/object/public/organization-logos/{organization_id}-{timestamp}.{ext}
```

Exemplo:
```
https://usidtjpjymomofyqolwe.supabase.co/storage/v1/object/public/organization-logos/1244da6e-b5ec-4ff0-b658-4e9683a47b58-1732659123456.png
```

---

## 🐛 Troubleshooting

### "Bucket not found"
- Verifique se o bucket foi criado com o nome exato: `organization-logos`
- Verifique se está no projeto correto

### "Permission denied"
- Verifique se marcou **"Public bucket"**
- Verifique se as policies estão corretas

### Upload falha
- Verifique o tamanho da imagem (máximo 2MB)
- Verifique se é uma imagem válida (PNG, JPG, SVG)
- Veja os logs de erro no console do navegador

---

## 💡 Dicas

- **Tamanho recomendado**: 200x200px ou 400x400px
- **Formato preferido**: PNG com fundo transparente
- **Tamanho máximo**: 2MB
- **Proporção**: Quadrada ou retangular (até 3:1)

