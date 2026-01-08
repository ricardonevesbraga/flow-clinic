-- =====================================================
-- MIGRATION 010: Adicionar Logo às Organizações
-- =====================================================

-- 1. Adicionar coluna logo_url
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

COMMENT ON COLUMN organizations.logo_url IS 'URL do logo da organização armazenado no Supabase Storage';

-- 2. Criar bucket no Supabase Storage (se não existir)
-- Nota: Execute isso manualmente no Supabase Dashboard se necessário
-- Storage > Create Bucket > Name: "organization-logos" > Public: true

-- 3. Verificar
SELECT id, name, logo_url 
FROM organizations 
LIMIT 5;

