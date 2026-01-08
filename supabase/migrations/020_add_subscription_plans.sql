-- Adicionar coluna de plano na tabela organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'plano_a' CHECK (
  subscription_plan IN ('plano_a', 'plano_b', 'plano_c', 'plano_d')
);

-- Adicionar coluna para recursos habilitados por plano
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS plan_features JSONB DEFAULT '{
  "atendimento_inteligente": false,
  "agendamento_automatico": false,
  "lembretes_automaticos": false,
  "confirmacao_email": false,
  "base_conhecimento": false,
  "relatorios_avancados": false,
  "integracao_whatsapp": false,
  "multi_usuarios": false,
  "personalizacao_agente": false,
  "analytics": false
}'::jsonb;

-- Criar tabela de configuração de planos (para definir o que cada plano tem)
CREATE TABLE IF NOT EXISTS subscription_plan_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id TEXT UNIQUE NOT NULL CHECK (
    plan_id IN ('plano_a', 'plano_b', 'plano_c', 'plano_d')
  ),
  plan_name TEXT NOT NULL,
  plan_description TEXT,
  
  -- Recursos do plano
  atendimento_inteligente BOOLEAN DEFAULT false,
  agendamento_automatico BOOLEAN DEFAULT false,
  lembretes_automaticos BOOLEAN DEFAULT false,
  confirmacao_email BOOLEAN DEFAULT false,
  base_conhecimento BOOLEAN DEFAULT false,
  relatorios_avancados BOOLEAN DEFAULT false,
  integracao_whatsapp BOOLEAN DEFAULT false,
  multi_usuarios BOOLEAN DEFAULT false,
  personalizacao_agente BOOLEAN DEFAULT false,
  analytics BOOLEAN DEFAULT false,
  
  -- Limites do plano
  max_agendamentos_mes INTEGER,
  max_mensagens_whatsapp_mes INTEGER,
  max_usuarios INTEGER,
  max_pacientes INTEGER,
  
  -- Preço
  price_monthly DECIMAL(10, 2),
  price_annual DECIMAL(10, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão dos planos
INSERT INTO subscription_plan_configs (
  plan_id,
  plan_name,
  plan_description,
  atendimento_inteligente,
  agendamento_automatico,
  lembretes_automaticos,
  confirmacao_email,
  base_conhecimento,
  relatorios_avancados,
  integracao_whatsapp,
  multi_usuarios,
  personalizacao_agente,
  analytics,
  max_agendamentos_mes,
  max_mensagens_whatsapp_mes,
  max_usuarios,
  max_pacientes,
  price_monthly,
  price_annual
) VALUES 
  -- Plano A: Atendimento Inteligente
  (
    'plano_a',
    'Atendimento Inteligente',
    'Chatbot inteligente com IA para atendimento automatizado',
    true,   -- atendimento_inteligente
    false,  -- agendamento_automatico
    false,  -- lembretes_automaticos
    false,  -- confirmacao_email
    true,   -- base_conhecimento
    false,  -- relatorios_avancados
    true,   -- integracao_whatsapp
    false,  -- multi_usuarios
    true,   -- personalizacao_agente
    false,  -- analytics
    100,    -- max_agendamentos_mes
    1000,   -- max_mensagens_whatsapp_mes
    1,      -- max_usuarios
    500,    -- max_pacientes
    97.00,  -- price_monthly
    970.00  -- price_annual (10% desconto)
  ),
  
  -- Plano B: Atendimento Agendador
  (
    'plano_b',
    'Atendimento Agendador',
    'Sistema de agendamento automatizado com confirmações',
    false,  -- atendimento_inteligente
    true,   -- agendamento_automatico
    true,   -- lembretes_automaticos
    true,   -- confirmacao_email
    false,  -- base_conhecimento
    false,  -- relatorios_avancados
    true,   -- integracao_whatsapp
    true,   -- multi_usuarios
    false,  -- personalizacao_agente
    false,  -- analytics
    500,    -- max_agendamentos_mes
    2000,   -- max_mensagens_whatsapp_mes
    3,      -- max_usuarios
    1000,   -- max_pacientes
    147.00, -- price_monthly
    1470.00 -- price_annual (10% desconto)
  ),
  
  -- Plano C: Atendimento Total
  (
    'plano_c',
    'Atendimento Total',
    'Solução completa: IA + Agendamento + Relatórios',
    true,   -- atendimento_inteligente
    true,   -- agendamento_automatico
    true,   -- lembretes_automaticos
    true,   -- confirmacao_email
    true,   -- base_conhecimento
    true,   -- relatorios_avancados
    true,   -- integracao_whatsapp
    true,   -- multi_usuarios
    true,   -- personalizacao_agente
    true,   -- analytics
    2000,   -- max_agendamentos_mes
    10000,  -- max_mensagens_whatsapp_mes
    10,     -- max_usuarios
    5000,   -- max_pacientes
    297.00, -- price_monthly
    2970.00 -- price_annual (10% desconto)
  ),
  
  -- Plano D: Atendimento Escalável
  (
    'plano_d',
    'Atendimento Escalável',
    'Solução enterprise ilimitada com suporte prioritário',
    true,   -- atendimento_inteligente
    true,   -- agendamento_automatico
    true,   -- lembretes_automaticos
    true,   -- confirmacao_email
    true,   -- base_conhecimento
    true,   -- relatorios_avancados
    true,   -- integracao_whatsapp
    true,   -- multi_usuarios
    true,   -- personalizacao_agente
    true,   -- analytics
    NULL,   -- max_agendamentos_mes (ilimitado)
    NULL,   -- max_mensagens_whatsapp_mes (ilimitado)
    NULL,   -- max_usuarios (ilimitado)
    NULL,   -- max_pacientes (ilimitado)
    497.00, -- price_monthly
    4970.00 -- price_annual (10% desconto)
  )
ON CONFLICT (plan_id) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  plan_description = EXCLUDED.plan_description,
  atendimento_inteligente = EXCLUDED.atendimento_inteligente,
  agendamento_automatico = EXCLUDED.agendamento_automatico,
  lembretes_automaticos = EXCLUDED.lembretes_automaticos,
  confirmacao_email = EXCLUDED.confirmacao_email,
  base_conhecimento = EXCLUDED.base_conhecimento,
  relatorios_avancados = EXCLUDED.relatorios_avancados,
  integracao_whatsapp = EXCLUDED.integracao_whatsapp,
  multi_usuarios = EXCLUDED.multi_usuarios,
  personalizacao_agente = EXCLUDED.personalizacao_agente,
  analytics = EXCLUDED.analytics,
  max_agendamentos_mes = EXCLUDED.max_agendamentos_mes,
  max_mensagens_whatsapp_mes = EXCLUDED.max_mensagens_whatsapp_mes,
  max_usuarios = EXCLUDED.max_usuarios,
  max_pacientes = EXCLUDED.max_pacientes,
  price_monthly = EXCLUDED.price_monthly,
  price_annual = EXCLUDED.price_annual,
  updated_at = NOW();

-- Habilitar RLS na tabela de configuração de planos
ALTER TABLE subscription_plan_configs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - apenas super admins podem editar
CREATE POLICY "Super admins can view plan configs"
  ON subscription_plan_configs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_super_admin = true
    )
  );

CREATE POLICY "Super admins can manage plan configs"
  ON subscription_plan_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_super_admin = true
    )
  );

-- Todos podem ver os planos (para escolher na criação)
CREATE POLICY "Anyone can view plan configs for selection"
  ON subscription_plan_configs FOR SELECT
  USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_subscription_plan_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_plan_configs_updated_at
  BEFORE UPDATE ON subscription_plan_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_plan_configs_updated_at();

-- Índices
CREATE INDEX idx_organizations_subscription_plan ON organizations(subscription_plan);
CREATE INDEX idx_subscription_plan_configs_plan_id ON subscription_plan_configs(plan_id);

