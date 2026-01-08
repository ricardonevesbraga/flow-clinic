# 📅 Atualização: Data/Hora Início e Fim com Timezone

## 🎯 O Que Mudou

### ✅ **Novos Campos no Formulário**
Agora ao criar um evento você pode definir:
- **Data Início** + **Hora Início**
- **Data Fim** + **Hora Fim**

### ✅ **Banco de Dados Atualizado**
Novos campos na tabela `appointments`:
- `start_datetime` (TIMESTAMP WITH TIME ZONE)
- `end_datetime` (TIMESTAMP WITH TIME ZONE)

### ✅ **Timezone São Paulo**
Todas as datas são enviadas para o webhook no formato **ISO8601 com timezone de São Paulo** (`-03:00`)

## 📋 Formato ISO8601 com Timezone

### Exemplo de Payload do Webhook:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "start_datetime": "2024-11-25T14:30:00-03:00",
  "end_datetime": "2024-11-25T15:30:00-03:00",
  "patient_id": "550e8400-e29b-41d4-a716-446655440001",
  "patient_name": "João Silva",
  "patient_email": "joao@email.com",
  "patient_phone": "+351 912 345 678",
  "type": "Consulta",
  "status": "pending",
  "created_at": "2024-11-25T19:30:00.000Z"
}
```

### Campos Atualizados:
| Campo Antigo | Campo Novo | Formato | Exemplo |
|--------------|------------|---------|---------|
| `date` | `start_datetime` | ISO8601 + TZ | `2024-11-25T14:30:00-03:00` |
| `time` | *(incluído no start_datetime)* | - | - |
| *(novo)* | `end_datetime` | ISO8601 + TZ | `2024-11-25T15:30:00-03:00` |

## 🛠️ Mudanças Técnicas

### 1. Nova Migration SQL

**Arquivo**: `supabase/migrations/002_add_datetime_fields.sql`

```sql
ALTER TABLE appointments 
ADD COLUMN start_datetime TIMESTAMP WITH TIME ZONE,
ADD COLUMN end_datetime TIMESTAMP WITH TIME ZONE;

-- Migrar dados existentes
UPDATE appointments 
SET 
  start_datetime = (date || ' ' || time)::timestamp AT TIME ZONE 'America/Sao_Paulo',
  end_datetime = (date || ' ' || time)::timestamp AT TIME ZONE 'America/Sao_Paulo' + interval '1 hour'
WHERE start_datetime IS NULL;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_appointments_start_datetime ON appointments(start_datetime);
CREATE INDEX IF NOT EXISTS idx_appointments_end_datetime ON appointments(end_datetime);
```

### 2. Utilitários de Data

**Arquivo**: `src/lib/dateUtils.ts`

Funções criadas:
- ✅ `toSaoPauloISO(date, time)` - Converte para ISO8601 com TZ São Paulo
- ✅ `formatDateTime(datetime)` - Formata para exibição (DD/MM/YYYY HH:MM)
- ✅ `getDurationMinutes(start, end)` - Calcula duração em minutos
- ✅ `addMinutes(dateTime, minutes)` - Adiciona minutos a uma data

### 3. Tipos TypeScript Atualizados

**Arquivo**: `src/types/database.ts`

```typescript
appointments: {
  Row: {
    // ... campos existentes ...
    start_datetime: string | null
    end_datetime: string | null
  }
  Insert: {
    // ... campos existentes ...
    start_datetime?: string | null
    end_datetime?: string | null
  }
}
```

### 4. Formulário Atualizado

**Arquivo**: `src/pages/Agenda.tsx`

Novos campos no formulário:
```typescript
{
  start_date: "",    // Data início (YYYY-MM-DD)
  start_time: "",    // Hora início (HH:MM)
  end_date: "",      // Data fim (YYYY-MM-DD)
  end_time: "",      // Hora fim (HH:MM)
  // ... outros campos ...
}
```

## 🚀 Como Usar

### 1. Executar a Migration

No painel do Supabase, execute:

```sql
-- Cole o conteúdo de supabase/migrations/002_add_datetime_fields.sql
```

Ou use a CLI do Supabase:

```bash
supabase db push
```

### 2. Criar um Compromisso

1. Acesse http://localhost:5173/agenda
2. Clique em "Novo Evento"
3. Preencha:
   - **Data Início**: 25/11/2024
   - **Hora Início**: 14:30
   - **Data Fim**: 25/11/2024
   - **Hora Fim**: 15:30
   - Paciente, Tipo, Status
4. Clique em "Criar Compromisso"

### 3. Verificar Webhook

O webhook receberá:

```json
{
  "start_datetime": "2024-11-25T14:30:00-03:00",
  "end_datetime": "2024-11-25T15:30:00-03:00"
}
```

## ✅ Validações Implementadas

### 1. Campos Obrigatórios
- ✅ Data início
- ✅ Hora início
- ✅ Data fim
- ✅ Hora fim
- ✅ Paciente
- ✅ Tipo

### 2. Validação de Datas
- ✅ Data/hora fim deve ser **posterior** à data/hora início
- ✅ Exibe mensagem de erro se inválido

```typescript
if (endDateTime <= startDateTime) {
  toast.error("Data/hora de fim deve ser posterior ao início");
  return;
}
```

## 🎨 UX Melhorada

### Auto-preenchimento
Ao selecionar a data início, a data fim é **preenchida automaticamente** com o mesmo valor.

### Valores Padrão
Ao abrir o formulário:
- Data início: **Hoje**
- Hora início: **09:00**
- Data fim: **Hoje**
- Hora fim: **10:00** (1 hora após)

## 📊 Exemplos de Uso no N8N

### 1. Calcular Duração

```javascript
// No N8N
const start = new Date($json.start_datetime);
const end = new Date($json.end_datetime);
const durationMinutes = (end - start) / (1000 * 60);

console.log(`Duração: ${durationMinutes} minutos`);
```

### 2. Formatar para WhatsApp

```javascript
const start = new Date($json.start_datetime);
const options = { 
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

const formatted = start.toLocaleString('pt-BR', options);
// Output: "25/11/2024, 14:30"
```

### 3. Adicionar ao Google Calendar

```javascript
// No N8N, node do Google Calendar
{
  "summary": $json.patient_name + " - " + $json.type,
  "start": {
    "dateTime": $json.start_datetime,
    "timeZone": "America/Sao_Paulo"
  },
  "end": {
    "dateTime": $json.end_datetime,
    "timeZone": "America/Sao_Paulo"
  }
}
```

## 🔍 Debug

### Verificar Timezone no Console

Após criar um compromisso, abra o Console (F12):

```
✅ Webhook disparado com sucesso
📤 Payload: {
  start_datetime: "2024-11-25T14:30:00-03:00",
  end_datetime: "2024-11-25T15:30:00-03:00"
}
```

### Verificar no Banco

```sql
SELECT 
  id,
  patient_name,
  start_datetime,
  end_datetime,
  start_datetime AT TIME ZONE 'America/Sao_Paulo' as local_time
FROM appointments
ORDER BY start_datetime DESC
LIMIT 10;
```

## 🔄 Compatibilidade

### Dados Antigos

Os campos `date` e `time` **ainda existem** para compatibilidade.

A migration **migra automaticamente** os dados antigos:
- `date` + `time` → `start_datetime`
- `start_datetime` + 1 hora → `end_datetime`

### Remover Campos Antigos (Opcional)

Quando tiver **100% de certeza** que tudo funciona, descomente no SQL:

```sql
ALTER TABLE appointments DROP COLUMN date;
ALTER TABLE appointments DROP COLUMN time;
```

## 📝 Checklist de Implementação

- ✅ Migration SQL criada
- ✅ Tipos TypeScript atualizados
- ✅ Utilitários de data criados
- ✅ Formulário com campos início/fim
- ✅ Validação de datas
- ✅ Webhook com ISO8601 + TZ
- ✅ Auto-preenchimento de data fim
- ✅ Valores padrão no formulário
- ✅ Logs de debug
- ✅ Documentação completa

## 🎯 Próximos Passos

1. **Executar Migration** no Supabase
2. **Testar criação** de compromisso
3. **Verificar webhook** no N8N
4. **Confirmar timezone** correto
5. **Ajustar N8N** para usar novos campos
6. *(Opcional)* Remover campos `date` e `time` antigos

---

**Status**: ✅ **Implementado e Pronto para Uso**

Última atualização: 25/11/2024

## 🆘 Suporte

### Erro: "Data/hora de fim deve ser posterior ao início"

**Causa**: Data/hora fim é igual ou anterior ao início

**Solução**: Certifique-se de que a hora fim é posterior à hora início

### Erro: "Preencha todos os campos obrigatórios"

**Causa**: Algum campo obrigatório está vazio

**Solução**: Preencha data início, hora início, data fim, hora fim, paciente e tipo

### Timezone Incorreto no N8N

**Causa**: N8N interpretando horário em UTC

**Solução**: Use sempre o campo `start_datetime` que já vem com timezone `-03:00`

```javascript
// CORRETO ✅
const start = new Date($json.start_datetime);

// ERRADO ❌
const start = new Date($json.date + "T" + $json.time);
```

