-- Migration: Adicionar tabela de instâncias do WhatsApp
-- Descrição: Armazena informações das instâncias do WhatsApp conectadas por organização

-- Cria a tabela de instâncias do WhatsApp
CREATE TABLE public.whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Dados da instância retornados pelo webhook
  instance_id TEXT NOT NULL UNIQUE, -- id retornado pelo webhook
  token TEXT NOT NULL,
  instance_name TEXT NOT NULL, -- name retornado pelo webhook
  admin_field_01 TEXT NOT NULL, -- adminField01 (nome da empresa formatado)
  phone TEXT NOT NULL, -- telefone conectado
  webhook_created TEXT, -- created date do webhook
  
  -- Status da conexão
  status TEXT NOT NULL DEFAULT 'pending', -- pending, connected, disconnected, error
  qr_code TEXT, -- QR code para pareamento (se disponível)
  pairing_code TEXT, -- código de pareamento (se disponível)
  
  -- Garante apenas uma instância ativa por organização
  UNIQUE(organization_id, instance_id)
);

-- Adiciona comentários
COMMENT ON TABLE public.whatsapp_instances IS 'Instâncias do WhatsApp conectadas por organização';
COMMENT ON COLUMN public.whatsapp_instances.instance_id IS 'ID da instância retornado pelo webhook';
COMMENT ON COLUMN public.whatsapp_instances.token IS 'Token de autenticação da instância';
COMMENT ON COLUMN public.whatsapp_instances.instance_name IS 'Nome da instância (slug)';
COMMENT ON COLUMN public.whatsapp_instances.admin_field_01 IS 'Nome formatado da empresa';
COMMENT ON COLUMN public.whatsapp_instances.phone IS 'Telefone conectado ao WhatsApp';
COMMENT ON COLUMN public.whatsapp_instances.status IS 'Status: pending, connected, disconnected, error';

-- Habilita RLS
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: usuários podem ver apenas instâncias da sua organização
CREATE POLICY "Users can view their organization whatsapp instances"
  ON public.whatsapp_instances
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Política de INSERT: usuários podem criar instâncias para sua organização
CREATE POLICY "Users can create their organization whatsapp instances"
  ON public.whatsapp_instances
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Política de UPDATE: usuários podem atualizar instâncias da sua organização
CREATE POLICY "Users can update their organization whatsapp instances"
  ON public.whatsapp_instances
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Política de DELETE: usuários podem deletar instâncias da sua organização
CREATE POLICY "Users can delete their organization whatsapp instances"
  ON public.whatsapp_instances
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Super admins têm acesso total
CREATE POLICY "Super admins have full access to whatsapp instances"
  ON public.whatsapp_instances
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- Índices para performance
CREATE INDEX idx_whatsapp_instances_organization ON public.whatsapp_instances(organization_id);
CREATE INDEX idx_whatsapp_instances_instance_id ON public.whatsapp_instances(instance_id);
CREATE INDEX idx_whatsapp_instances_status ON public.whatsapp_instances(status);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_whatsapp_instances_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_whatsapp_instances_updated_at
  BEFORE UPDATE ON public.whatsapp_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_instances_updated_at();

