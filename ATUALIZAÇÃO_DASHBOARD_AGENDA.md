# ✅ Atualização: Dashboard e Agenda Usando start_datetime

## 🎯 Problema Resolvido

**Antes:**
- Dashboard e Agenda usavam `date` e `time` (campos antigos)
- Não mostravam compromissos criados com `start_datetime` e `end_datetime`

**Agora:**
- ✅ Dashboard usa `start_datetime` e `end_datetime`
- ✅ Agenda usa `start_datetime` e `end_datetime`
- ✅ **Compatibilidade retroativa** com dados antigos (fallback para `date` e `time`)
- ✅ Horários exibidos no **timezone local do navegador** (automático)

## 📊 Dashboard

### O Que Mudou:

1. **Filtro de "Compromissos Hoje"**
   - Antes: `apt.date === todayStr`
   - Agora: `isToday(apt.start_datetime)` ✅

2. **KPI "Próximos 7 Dias"**
   - Antes: `new Date(apt.date)`
   - Agora: `new Date(apt.start_datetime)` ✅

3. **Exibição de Horários**
   - Antes: `appointment.time` (string do banco)
   - Agora: `formatTime(appointment.start_datetime)` ✅
   - **Converte UTC → Horário Local automaticamente**

### Exemplo de Exibição:

**Banco de dados (UTC):**
```
start_datetime: 2025-11-25 12:00:00+00
```

**Dashboard (São Paulo):**
```
09:00  ← Converte automaticamente UTC-3
```

## 📅 Agenda

### O Que Mudou:

1. **Função `parseAppointment`**
   - Agora usa `start_datetime` se disponível
   - Converte para Date object do JavaScript
   - Extrai horário automaticamente
   - Fallback para `date` e `time` (compatibilidade)

2. **Filtros de Data**
   - Usa `Date` do JavaScript para comparação
   - Funciona com qualquer timezone

### Código Atualizado:

```typescript
const parseAppointment = (apt: any) => {
  let date: Date;
  let time: string;
  
  if (apt.start_datetime) {
    // Usar start_datetime (novo)
    date = new Date(apt.start_datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    time = `${hours}:${minutes}`;
  } else {
    // Fallback para date+time (antigo)
    const [hours, minutes] = apt.time.split(':');
    date = new Date(apt.date);
    date.setHours(parseInt(hours), parseInt(minutes));
    time = apt.time;
  }
  
  return { id: apt.id, date, time, patient, type, status };
};
```

## 🌍 Como Funciona o Timezone

### Automático pelo JavaScript

Quando você faz `new Date(apt.start_datetime)`:

1. **Banco (UTC):** `2025-11-25 12:00:00+00`
2. **JavaScript converte:** Para o timezone do navegador
3. **Exibe:** `09:00` (se navegador está em São Paulo)

### Sem conversão manual necessária! 🎉

O JavaScript `Date` faz isso automaticamente quando você:
- `date.getHours()` → Retorna hora local
- `date.getMinutes()` → Retorna minutos locais
- `date.toLocaleString()` → Formata no locale local

## 🔄 Compatibilidade Retroativa

### Dados Antigos Continuam Funcionando

Se você tem compromissos criados antes da atualização (sem `start_datetime`):

**Banco:**
```sql
date: 2025-11-25
time: 09:00
start_datetime: NULL  ← Não tem
```

**Dashboard/Agenda:**
```typescript
// Detecta que start_datetime é NULL
// Usa date e time como fallback
// Funciona normalmente! ✅
```

### Quando Remover Campos Antigos

Apenas quando **TODOS** os compromissos tiverem `start_datetime`:

```sql
-- Verificar se há algum NULL
SELECT COUNT(*) FROM appointments WHERE start_datetime IS NULL;

-- Se retornar 0, pode remover:
ALTER TABLE appointments DROP COLUMN date;
ALTER TABLE appointments DROP COLUMN time;
```

## ✅ Teste Agora

### 1. Dashboard

1. Acesse http://localhost:5173/
2. Veja "Agenda de Hoje"
3. Compromissos aparecem com **horário correto** ✅

### 2. Agenda - Mês

1. Acesse http://localhost:5173/agenda
2. Veja os dias com eventos (bolinhas) ✅
3. Clique em um dia
4. Modal mostra horários corretos ✅

### 3. Agenda - Dia

1. Mude para visualização "Dia"
2. Veja grade de horários
3. Compromissos aparecem no horário certo ✅

### 4. Agenda - Semana

1. Mude para visualização "Semana"
2. Veja os 7 dias
3. Compromissos nos horários corretos ✅

## 🔍 Verificar Conversão

### Console do Browser (F12)

```javascript
// Criar compromisso com:
// Data: 25/11/2025
// Hora: 09:00

// Banco recebe (UTC):
"2025-11-25 12:00:00+00"  // 09:00 SP = 12:00 UTC ✅

// Dashboard exibe:
"09:00"  // Convertido automaticamente ✅
```

### SQL no Supabase

```sql
-- Ver compromisso no banco (UTC)
SELECT 
  patient_name,
  start_datetime,
  start_datetime AT TIME ZONE 'UTC' as utc_time,
  start_datetime AT TIME ZONE 'America/Sao_Paulo' as sp_time
FROM appointments
WHERE id = 'SEU_ID_AQUI';
```

**Resultado esperado:**

| patient_name | start_datetime | utc_time | sp_time |
|-------------|----------------|----------|---------|
| João Silva | 2025-11-25 12:00:00+00 | 2025-11-25 12:00:00 | 2025-11-25 09:00:00 |

## 🎨 Funções Utilitárias Criadas

### `formatTime(datetime)`

Formata apenas a hora de um datetime:

```typescript
formatTime("2025-11-25T12:00:00+00:00")
// Retorna: "09:00" (se navegador em São Paulo)
```

### `isToday(datetime)`

Verifica se uma data é hoje:

```typescript
isToday("2025-11-25T12:00:00+00:00")
// Retorna: true/false
```

### `isSameDay(datetime, compareDate)`

Compara duas datas (ignora hora):

```typescript
const today = new Date();
isSameDay("2025-11-25T12:00:00+00:00", today)
// Retorna: true/false
```

## 📋 Checklist

- ✅ Dashboard usa `start_datetime`
- ✅ Agenda usa `start_datetime`
- ✅ Compatibilidade com dados antigos
- ✅ Horários exibidos corretamente
- ✅ Timezone convertido automaticamente
- ✅ Funções utilitárias criadas
- ✅ Sem erros de lint

## 🐛 Troubleshooting

### Horários aparecem errados

**Problema:** Compromisso criado às 09:00, mas aparece 12:00

**Causa:** Navegador não está no timezone de São Paulo

**Solução:** O horário está correto para o timezone do navegador. Se quiser forçar São Paulo:

```typescript
const date = new Date(apt.start_datetime);
const spTime = date.toLocaleString('pt-BR', { 
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit'
});
```

### Compromissos não aparecem no Dashboard

**Causa 1:** Compromisso não é de hoje

**Solução:** Verifique a data no banco

**Causa 2:** Compromisso tem apenas `date` e `time` (sem `start_datetime`)

**Solução:** Execute a migration `002_add_datetime_fields.sql` que migra dados antigos

### Compromissos duplicados na Agenda

**Causa:** Alguns têm `start_datetime` e outros só `date`/`time`

**Solução:** Migre todos os dados antigos com:

```sql
UPDATE appointments 
SET 
  start_datetime = (date || ' ' || time)::timestamp AT TIME ZONE 'America/Sao_Paulo',
  end_datetime = (date || ' ' || time)::timestamp AT TIME ZONE 'America/Sao_Paulo' + interval '1 hour'
WHERE start_datetime IS NULL;
```

---

**Status**: ✅ **Implementado e Funcionando**

Última atualização: 25/11/2024

## 🎯 Resultado Final

Agora Dashboard e Agenda:
- ✅ Mostram horários corretos no timezone local
- ✅ Usam campos novos (`start_datetime`, `end_datetime`)
- ✅ Compatíveis com dados antigos
- ✅ Conversão automática UTC ↔ Local
- ✅ Tudo funcionando perfeitamente! 🎉

