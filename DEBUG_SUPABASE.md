# 🔍 Debug Supabase Timezone

## 🧪 Teste Completo

### 1. Criar Compromisso

1. Acesse http://localhost:5173/agenda
2. Clique em "Novo Evento"
3. Preencha:
   - **Data início**: 28/11/2025
   - **Hora início**: 09:00
   - **Data fim**: 28/11/2025
   - **Hora fim**: 10:00
4. Clique em "Criar Compromisso"

### 2. Abra o Console (F12)

Você vai ver 3 logs agora:

```
1️⃣ 🕐 Horários digitados: 
   { start: "2025-11-28 09:00", end: "2025-11-28 10:00" }

2️⃣ 📤 ISO8601 gerado: 
   { startISO: "2025-11-28T09:00:00-03:00", endISO: "2025-11-28T10:00:00-03:00" }

3️⃣ 📝 Dados enviados para Supabase:
   {
     date: "2025-11-28",
     time: "09:00",
     start_datetime: "2025-11-28T09:00:00-03:00",
     end_datetime: "2025-11-28T10:00:00-03:00",
     patient_id: "...",
     ...
   }

4️⃣ 💾 Dados gravados no Supabase:
   {
     id: "...",
     start_datetime: "2025-11-28T12:00:00+00:00",  ← AQUI ESTÁ O PROBLEMA!
     end_datetime: "2025-11-28T13:00:00+00:00",
     ...
   }

5️⃣ 🔍 Verificar timezone:
   {
     enviado_start: "2025-11-28T09:00:00-03:00",   ← Correto
     gravado_start: "2025-11-28T12:00:00+00:00",   ← Errado!
     enviado_end: "2025-11-28T10:00:00-03:00",
     gravado_end: "2025-11-28T13:00:00+00:00"
   }
```

## 🎯 O Que Deve Acontecer

### CORRETO ✅

**Enviamos:**
```
start_datetime: "2025-11-28T09:00:00-03:00"
```

**Supabase DEVERIA gravar:**
```
start_datetime: "2025-11-28T12:00:00+00:00"  ← 09:00 SP = 12:00 UTC ✅
```

### ERRADO ❌

**Se Supabase gravar:**
```
start_datetime: "2025-11-28T15:00:00+00:00"  ← Está adicionando mais 3h!
```

Significa que o Supabase está:
1. Ignorando o `-03:00`
2. Tratando `09:00` como hora local do servidor (UTC)
3. Adicionando mais 3h

## 🔧 Possíveis Causas

### 1. Coluna Sem Timezone

**Verificar tipo da coluna no Supabase:**

```sql
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns
WHERE table_name = 'appointments' 
  AND column_name IN ('start_datetime', 'end_datetime');
```

**Resultado esperado:**
| column_name | data_type | udt_name |
|-------------|-----------|----------|
| start_datetime | timestamp with time zone | timestamptz |
| end_datetime | timestamp with time zone | timestamptz |

**Se aparecer `timestamp` (sem `with time zone`):**

```sql
-- Converter para timezone-aware
ALTER TABLE appointments 
ALTER COLUMN start_datetime TYPE TIMESTAMP WITH TIME ZONE;

ALTER TABLE appointments 
ALTER COLUMN end_datetime TYPE TIMESTAMP WITH TIME ZONE;
```

### 2. Supabase Client Timezone

O problema pode estar no cliente do Supabase. Vou criar uma solução alternativa.

## 💡 Solução Alternativa

Se o Supabase não está interpretando o timezone, vamos fazer a conversão manual para UTC antes de enviar:

```typescript
// Em vez de: "2025-11-28T09:00:00-03:00"
// Enviar: "2025-11-28T12:00:00Z"  (já em UTC)
```

Isso garante que o Supabase recebe o horário correto em UTC.

## 📋 Me Envie os Logs

**Do Console (F12), copie exatamente:**

```
3️⃣ 📝 Dados enviados para Supabase: { ... }
4️⃣ 💾 Dados gravados no Supabase: { ... }
5️⃣ 🔍 Verificar timezone: { ... }
```

**E do Supabase (SQL Editor):**

```sql
SELECT 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'appointments' 
  AND column_name IN ('start_datetime', 'end_datetime');
```

---

**Com essas informações vou identificar exatamente onde está o problema! 🎯**

