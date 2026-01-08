-- Tabela de horários de trabalho dos médicos
CREATE TABLE IF NOT EXISTS work_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dias da semana (segunda a domingo)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  -- 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  
  -- Horários de trabalho (formato TEXT para facilitar, ex: "08:00", "18:00")
  inicio_trabalho TEXT NOT NULL,
  fim_trabalho TEXT NOT NULL,
  inicio_almoco TEXT,
  fim_almoco TEXT,
  
  -- Se o médico trabalha neste dia
  is_working_day BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir que não haja duplicatas (um horário por dia por usuário)
  UNIQUE(organization_id, user_id, day_of_week)
);

-- Índices para melhorar performance
CREATE INDEX idx_work_schedules_org ON work_schedules(organization_id);
CREATE INDEX idx_work_schedules_user ON work_schedules(user_id);
CREATE INDEX idx_work_schedules_day ON work_schedules(day_of_week);

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

