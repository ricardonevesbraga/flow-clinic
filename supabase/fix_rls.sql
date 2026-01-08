-- Script para verificar e corrigir políticas RLS
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar quantos registros existem
SELECT 'Total de Pacientes:' as info, COUNT(*) as count FROM patients;
SELECT 'Total de Compromissos:' as info, COUNT(*) as count FROM appointments;

-- 2. Listar todos os pacientes
SELECT * FROM patients ORDER BY name;

-- 3. Verificar políticas RLS atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('patients', 'appointments', 'settings');

-- 4. OPCIONAL: Se houver problemas, remover políticas antigas e recriar
-- DESCOMENTE APENAS SE NECESSÁRIO

-- DROP POLICY IF EXISTS "Enable read access for all users" ON patients;
-- DROP POLICY IF EXISTS "Enable insert for all users" ON patients;
-- DROP POLICY IF EXISTS "Enable update for all users" ON patients;
-- DROP POLICY IF EXISTS "Enable delete for all users" ON patients;

-- DROP POLICY IF EXISTS "Enable read access for all users" ON appointments;
-- DROP POLICY IF EXISTS "Enable insert for all users" ON appointments;
-- DROP POLICY IF EXISTS "Enable update for all users" ON appointments;
-- DROP POLICY IF EXISTS "Enable delete for all users" ON appointments;

-- 5. Recriar políticas (permitindo acesso total para desenvolvimento)
-- DESCOMENTE APENAS SE NECESSÁRIO

-- CREATE POLICY "Allow all for patients" ON patients FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Ou simplesmente desabilitar RLS temporariamente (APENAS PARA DESENVOLVIMENTO)
-- DESCOMENTE APENAS SE NECESSÁRIO

-- ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 7. Verificar se há duplicatas
SELECT email, COUNT(*) as count 
FROM patients 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 8. Teste de conexão - deve retornar todos os 9 pacientes
SELECT 
  COUNT(*) as total_patients,
  COUNT(*) FILTER (WHERE status = 'active') as active_patients,
  COUNT(*) FILTER (WHERE status = 'inactive') as inactive_patients
FROM patients;

