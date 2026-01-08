-- Adicionar coluna contact_email à tabela organizations
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Comentário descritivo
COMMENT ON COLUMN public.organizations.contact_email IS 'E-mail de contato da organização usado em comunicações como confirmação de agendamentos';

