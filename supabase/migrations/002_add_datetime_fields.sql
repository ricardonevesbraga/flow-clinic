-- Adicionar campos de data/hora início e fim na tabela appointments

-- 1. Adicionar novas colunas
ALTER TABLE appointments 
ADD COLUMN start_datetime TIMESTAMP WITH TIME ZONE,
ADD COLUMN end_datetime TIMESTAMP WITH TIME ZONE;

-- 2. Migrar dados existentes (date + time -> start_datetime)
-- Assumindo que os compromissos duram 1 hora por padrão
UPDATE appointments 
SET 
  start_datetime = (date || ' ' || time)::timestamp AT TIME ZONE 'America/Sao_Paulo',
  end_datetime = (date || ' ' || time)::timestamp AT TIME ZONE 'America/Sao_Paulo' + interval '1 hour'
WHERE start_datetime IS NULL;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_appointments_start_datetime ON appointments(start_datetime);
CREATE INDEX IF NOT EXISTS idx_appointments_end_datetime ON appointments(end_datetime);

-- 4. Comentários para documentação
COMMENT ON COLUMN appointments.start_datetime IS 'Data e hora de início do compromisso (timezone-aware)';
COMMENT ON COLUMN appointments.end_datetime IS 'Data e hora de fim do compromisso (timezone-aware)';

-- 5. OPCIONAL: Remover campos antigos date e time após confirmar que tudo funciona
-- Descomente estas linhas quando estiver 100% certo que os novos campos funcionam
-- ALTER TABLE appointments DROP COLUMN date;
-- ALTER TABLE appointments DROP COLUMN time;

-- Por enquanto, vamos manter date e time para compatibilidade

