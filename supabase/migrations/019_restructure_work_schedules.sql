-- Dropar tabela antiga
DROP TABLE IF EXISTS work_schedules;

-- Criar nova tabela com estrutura horizontal (uma linha por usuário)
CREATE TABLE IF NOT EXISTS work_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- DOMINGO (0)
  domingo_is_active BOOLEAN DEFAULT false,
  domingo_inicio_trabalho TEXT,
  domingo_fim_trabalho TEXT,
  domingo_inicio_almoco TEXT,
  domingo_fim_almoco TEXT,
  
  -- SEGUNDA-FEIRA (1)
  segunda_is_active BOOLEAN DEFAULT true,
  segunda_inicio_trabalho TEXT DEFAULT '08:00',
  segunda_fim_trabalho TEXT DEFAULT '18:00',
  segunda_inicio_almoco TEXT DEFAULT '12:00',
  segunda_fim_almoco TEXT DEFAULT '13:00',
  
  -- TERÇA-FEIRA (2)
  terca_is_active BOOLEAN DEFAULT true,
  terca_inicio_trabalho TEXT DEFAULT '08:00',
  terca_fim_trabalho TEXT DEFAULT '18:00',
  terca_inicio_almoco TEXT DEFAULT '12:00',
  terca_fim_almoco TEXT DEFAULT '13:00',
  
  -- QUARTA-FEIRA (3)
  quarta_is_active BOOLEAN DEFAULT true,
  quarta_inicio_trabalho TEXT DEFAULT '08:00',
  quarta_fim_trabalho TEXT DEFAULT '18:00',
  quarta_inicio_almoco TEXT DEFAULT '12:00',
  quarta_fim_almoco TEXT DEFAULT '13:00',
  
  -- QUINTA-FEIRA (4)
  quinta_is_active BOOLEAN DEFAULT true,
  quinta_inicio_trabalho TEXT DEFAULT '08:00',
  quinta_fim_trabalho TEXT DEFAULT '18:00',
  quinta_inicio_almoco TEXT DEFAULT '12:00',
  quinta_fim_almoco TEXT DEFAULT '13:00',
  
  -- SEXTA-FEIRA (5)
  sexta_is_active BOOLEAN DEFAULT true,
  sexta_inicio_trabalho TEXT DEFAULT '08:00',
  sexta_fim_trabalho TEXT DEFAULT '18:00',
  sexta_inicio_almoco TEXT DEFAULT '12:00',
  sexta_fim_almoco TEXT DEFAULT '13:00',
  
  -- SÁBADO (6)
  sabado_is_active BOOLEAN DEFAULT false,
  sabado_inicio_trabalho TEXT,
  sabado_fim_trabalho TEXT,
  sabado_inicio_almoco TEXT,
  sabado_fim_almoco TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir que só existe uma linha por usuário
  UNIQUE(organization_id, user_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_work_schedules_org_new ON work_schedules(organization_id);
CREATE INDEX idx_work_schedules_user_new ON work_schedules(user_id);

-- Habilitar RLS
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their organization's work schedules"
  ON work_schedules FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own work schedules"
  ON work_schedules FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own work schedules"
  ON work_schedules FOR UPDATE
  USING (
    user_id = auth.uid() AND
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own work schedules"
  ON work_schedules FOR DELETE
  USING (
    user_id = auth.uid() AND
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Super admins podem fazer tudo
CREATE POLICY "Super admins have full access to work schedules"
  ON work_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_super_admin = true
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_work_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_schedules_updated_at
  BEFORE UPDATE ON work_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_work_schedules_updated_at();

