-- Adicionar campo de observações na tabela appointments

-- Verificar se a coluna já existe (notes)
DO $$ 
BEGIN
  -- Se já existe coluna 'notes', renomear para 'observations' (mais claro)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'notes'
  ) THEN
    ALTER TABLE appointments RENAME COLUMN notes TO observations;
  END IF;
END $$;

-- Adicionar coluna observations se não existir
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS observations TEXT;

-- Adicionar índice para busca
CREATE INDEX IF NOT EXISTS idx_appointments_observations ON appointments USING gin(to_tsvector('portuguese', coalesce(observations, '')));

-- Comentário para documentação
COMMENT ON COLUMN appointments.observations IS 'Observações e notas sobre o compromisso';

