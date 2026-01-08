-- Add new columns to agent_ia_config table
ALTER TABLE public.agent_ia_config
ADD COLUMN IF NOT EXISTS reminder_1_minutes INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS reminder_2_minutes INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS reminder_3_minutes INTEGER DEFAULT 1440,
ADD COLUMN IF NOT EXISTS qualification_questions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS confirmation_email_body TEXT DEFAULT '<p>Olá, seu agendamento foi confirmado!</p>';
