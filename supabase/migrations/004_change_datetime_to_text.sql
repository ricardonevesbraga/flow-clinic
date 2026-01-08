-- Mudar tipo das colunas de TIMESTAMP para TEXT
-- Isso permite armazenar o formato ISO8601 literal com timezone

-- 1. Criar colunas temporárias do tipo TEXT
ALTER TABLE appointments 
ADD COLUMN start_datetime_text TEXT,
ADD COLUMN end_datetime_text TEXT;

-- 2. Migrar dados existentes para formato ISO8601 com timezone São Paulo
UPDATE appointments 
SET 
  start_datetime_text = TO_CHAR(start_datetime AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD"T"HH24:MI:SS"-03:00"'),
  end_datetime_text = TO_CHAR(end_datetime AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD"T"HH24:MI:SS"-03:00"')
WHERE start_datetime IS NOT NULL;

-- 3. Remover colunas antigas
ALTER TABLE appointments 
DROP COLUMN IF EXISTS start_datetime,
DROP COLUMN IF EXISTS end_datetime;

-- 4. Renomear colunas novas
ALTER TABLE appointments 
RENAME COLUMN start_datetime_text TO start_datetime;

ALTER TABLE appointments 
RENAME COLUMN end_datetime_text TO end_datetime;

-- 5. Adicionar constraint de validação (formato ISO8601)
ALTER TABLE appointments 
ADD CONSTRAINT check_start_datetime_format 
CHECK (start_datetime IS NULL OR start_datetime ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$');

ALTER TABLE appointments 
ADD CONSTRAINT check_end_datetime_format 
CHECK (end_datetime IS NULL OR end_datetime ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$');

-- 6. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_appointments_start_datetime_text ON appointments(start_datetime);
CREATE INDEX IF NOT EXISTS idx_appointments_end_datetime_text ON appointments(end_datetime);

-- 7. Comentários
COMMENT ON COLUMN appointments.start_datetime IS 'Data/hora início no formato ISO8601 com timezone (TEXT): 2025-11-25T09:00:00-03:00';
COMMENT ON COLUMN appointments.end_datetime IS 'Data/hora fim no formato ISO8601 com timezone (TEXT): 2025-11-25T09:00:00-03:00';

