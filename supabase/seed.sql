-- Seed data para desenvolvimento
-- Execute este arquivo no SQL Editor do Supabase para popular o banco com dados de exemplo

-- Inserir configurações
INSERT INTO settings (clinic_name, doctor_name, subscription_plan, subscription_renews_at)
VALUES ('FlowClinic', 'Dr. Silva', 'premium', '2024-02-15T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Inserir pacientes
INSERT INTO patients (name, email, phone, status, last_visit, total_visits) VALUES
  ('Maria Santos', 'maria.santos@email.com', '+351 912 345 678', 'active', '2024-01-15', 12),
  ('João Silva', 'joao.silva@email.com', '+351 913 456 789', 'active', '2024-01-18', 8),
  ('Ana Costa', 'ana.costa@email.com', '+351 914 567 890', 'active', '2023-12-20', 5),
  ('Pedro Oliveira', 'pedro.oliveira@email.com', '+351 915 678 901', 'active', '2024-01-20', 15),
  ('Rita Mendes', 'rita.mendes@email.com', '+351 916 789 012', 'active', '2024-01-10', 6),
  ('Carlos Lima', 'carlos.lima@email.com', '+351 917 890 123', 'active', '2024-01-12', 9),
  ('Luisa Fernandes', 'luisa.fernandes@email.com', '+351 918 901 234', 'active', '2024-01-08', 4),
  ('Marco Paulo', 'marco.paulo@email.com', '+351 919 012 345', 'inactive', '2023-11-22', 3),
  ('Sofia Rodrigues', 'sofia.rodrigues@email.com', '+351 920 123 456', 'active', '2024-01-19', 11)
ON CONFLICT (email) DO NOTHING;

-- Inserir compromissos (ajuste as datas conforme necessário)
-- Usando IDs dos pacientes já inseridos
DO $$
DECLARE
  maria_id UUID;
  ana_id UUID;
  joao_id UUID;
  pedro_id UUID;
  rita_id UUID;
  carlos_id UUID;
  luisa_id UUID;
  marco_id UUID;
  sofia_id UUID;
BEGIN
  SELECT id INTO maria_id FROM patients WHERE email = 'maria.santos@email.com';
  SELECT id INTO ana_id FROM patients WHERE email = 'ana.costa@email.com';
  SELECT id INTO joao_id FROM patients WHERE email = 'joao.silva@email.com';
  SELECT id INTO pedro_id FROM patients WHERE email = 'pedro.oliveira@email.com';
  SELECT id INTO rita_id FROM patients WHERE email = 'rita.mendes@email.com';
  SELECT id INTO carlos_id FROM patients WHERE email = 'carlos.lima@email.com';
  SELECT id INTO luisa_id FROM patients WHERE email = 'luisa.fernandes@email.com';
  SELECT id INTO marco_id FROM patients WHERE email = 'marco.paulo@email.com';
  SELECT id INTO sofia_id FROM patients WHERE email = 'sofia.rodrigues@email.com';

  INSERT INTO appointments (date, time, patient_id, patient_name, type, status, notes) VALUES
    ('2024-11-15', '09:00', maria_id, 'Maria Santos', 'Consulta', 'confirmed', 'Primeira consulta'),
    ('2024-11-15', '14:00', ana_id, 'Ana Costa', 'Tratamento', 'confirmed', 'Sessão de tratamento'),
    ('2024-11-16', '10:30', joao_id, 'João Silva', 'Retorno', 'confirmed', 'Retorno pós-tratamento'),
    ('2024-11-16', '15:00', pedro_id, 'Pedro Oliveira', 'Consulta', 'pending', 'Aguardando confirmação'),
    ('2024-11-18', '11:00', rita_id, 'Rita Mendes', 'Avaliação', 'confirmed', 'Avaliação inicial'),
    ('2024-11-18', '16:30', carlos_id, 'Carlos Lima', 'Tratamento', 'confirmed', 'Continuação do tratamento'),
    ('2024-11-22', '09:30', luisa_id, 'Luisa Fernandes', 'Consulta', 'confirmed', 'Nova paciente'),
    ('2024-11-22', '14:30', marco_id, 'Marco Paulo', 'Retorno', 'pending', 'Verificar disponibilidade'),
    ('2024-11-25', '10:00', sofia_id, 'Sofia Rodrigues', 'Tratamento', 'confirmed', 'Sessão programada');
END $$;

