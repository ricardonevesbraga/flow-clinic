-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_visit TIMESTAMP WITH TIME ZONE,
  total_visits INTEGER DEFAULT 0
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  notes TEXT
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  clinic_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'premium',
  subscription_renews_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies (permitir acesso público por enquanto - ajuste conforme necessário)
CREATE POLICY "Enable read access for all users" ON patients FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON patients FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON patients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON appointments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON appointments FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON settings FOR UPDATE USING (true);

