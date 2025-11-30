-- Add customer_pause_duration_seconds to agent_ia_config table
-- Also rename pause_duration to pause_duration_seconds for consistency

-- Add new column for customer-requested pause (in seconds)
ALTER TABLE public.agent_ia_config
ADD COLUMN customer_pause_duration_seconds INTEGER DEFAULT 300 CHECK (customer_pause_duration_seconds >= 60 AND customer_pause_duration_seconds <= 86400);

-- Rename existing pause_duration to pause_duration_seconds and convert from minutes to seconds
-- First, add new column
ALTER TABLE public.agent_ia_config
ADD COLUMN pause_duration_seconds INTEGER;

-- Copy data, converting from minutes to seconds
UPDATE public.agent_ia_config
SET pause_duration_seconds = pause_duration * 60;

-- Set NOT NULL constraint and default
ALTER TABLE public.agent_ia_config
ALTER COLUMN pause_duration_seconds SET NOT NULL,
ALTER COLUMN pause_duration_seconds SET DEFAULT 1800;

-- Add check constraint (1 minute to 24 hours in seconds)
ALTER TABLE public.agent_ia_config
ADD CONSTRAINT chk_pause_duration_seconds CHECK (pause_duration_seconds >= 60 AND pause_duration_seconds <= 86400);

-- Drop old column
ALTER TABLE public.agent_ia_config
DROP COLUMN pause_duration;

-- Add comments
COMMENT ON COLUMN public.agent_ia_config.pause_duration_seconds IS 'Tempo de pausa em segundos quando atendente humano assume (60-86400)';
COMMENT ON COLUMN public.agent_ia_config.customer_pause_duration_seconds IS 'Tempo de pausa em segundos quando cliente solicita (60-86400)';

