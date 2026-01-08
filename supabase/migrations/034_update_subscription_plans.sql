-- Atualizar estrutura de planos para os 4 novos planos

-- Limpar configurações antigas e inserir novas
DELETE FROM subscription_plan_configs;

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
  -- Plano A: Apenas Atendimento
  (
    'plano_a',
    'Atendimento',
    'Chatbot inteligente com IA para atendimento automatizado via WhatsApp',
    true,   -- atendimento_inteligente
    false,  -- agendamento_automatico
    false,  -- lembretes_automaticos
    false,  -- confirmacao_email
    false,  -- base_conhecimento (SEM base de conhecimento)
    false,  -- relatorios_avancados
    true,   -- integracao_whatsapp
    false,  -- multi_usuarios
    true,   -- personalizacao_agente
    false,  -- analytics
    NULL,   -- max_agendamentos_mes (não tem agenda)
    1000,   -- max_mensagens_whatsapp_mes
    1,      -- max_usuarios
    500,    -- max_pacientes
    97.00,  -- price_monthly
    970.00  -- price_annual
  ),
  
  -- Plano B: Atendimento + Base de Conhecimento
  (
    'plano_b',
    'Atendimento + Conhecimento',
    'Atendimento inteligente com base de conhecimento personalizada',
    true,   -- atendimento_inteligente
    false,  -- agendamento_automatico (SEM agendamento)
    false,  -- lembretes_automaticos
    false,  -- confirmacao_email
    true,   -- base_conhecimento
    false,  -- relatorios_avancados
    true,   -- integracao_whatsapp
    false,  -- multi_usuarios
    true,   -- personalizacao_agente
    false,  -- analytics
    NULL,   -- max_agendamentos_mes (não tem agenda)
    2000,   -- max_mensagens_whatsapp_mes
    2,      -- max_usuarios
    1000,   -- max_pacientes
    147.00, -- price_monthly
    1470.00 -- price_annual
  ),
  
  -- Plano C: Atendimento + Conhecimento + Agendamento (Completo)
  (
    'plano_c',
    'Atendimento Completo',
    'Solução completa: Atendimento IA + Base de Conhecimento + Agendamento Automático',
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
    5000,   -- max_mensagens_whatsapp_mes
    5,      -- max_usuarios
    5000,   -- max_pacientes
    297.00, -- price_monthly
    2970.00 -- price_annual
  ),
  
  -- Plano D: Implementação Futura
  (
    'plano_d',
    'Enterprise',
    'Plano personalizado para grandes operações - Entre em contato',
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
    NULL,   -- price_monthly (sob consulta)
    NULL    -- price_annual (sob consulta)
  );

