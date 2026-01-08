# 🔧 Correção de Timezone

## ❌ Problema Identificado

### O que estava acontecendo:

**Entrada do usuário:**
- Data: 27/11/2025
- Hora início: 20:00
- Hora fim: 21:00

**Resultado ERRADO:**
- Banco de dados: `2025-11-28 02:00:00+00` (6 horas a mais!)
- Webhook: `2025-11-27T23:00:00-03:00` (3 horas a mais!)

**Esperado:**
- Banco de dados: `2025-11-27 23:00:00+00` (20:00 SP = 23:00 UTC)
- Webhook: `2025-11-27T20:00:00-03:00`

## ✅ Solução Aplicada

A função `toSaoPauloISO` estava fazendo conversões desnecessárias. 

### Antes (ERRADO):
```typescript
export function toSaoPauloISO(date: string, time: string): string {
  const dateObj = new Date(dateTimeStr);
  // ... conversões complexas e erradas ...
  return formatado;
}
```

### Depois (CORRETO):
```typescript
export function toSaoPauloISO(date: string, time: string): string {
  // Usuário já digita no horário de São Paulo
  // Apenas adiciona o timezone -03:00
  return `${date}T${time}:00-03:00`;
}
```

## 🎯 Como Funciona Agora

1. **Usuário digita**: `27/11/2025` e `20:00`
2. **Função formata**: `2025-11-27T20:00:00-03:00`
3. **Supabase converte para UTC**: `2025-11-27 23:00:00+00` ✅
4. **Webhook recebe**: `2025-11-27T20:00:00-03:00` ✅

## ✅ Teste Novamente

1. Acesse http://localhost:5173/agenda
2. Clique em "Novo Evento"
3. Crie um compromisso:
   - Data início: `27/11/2025`
   - Hora início: `20:00`
   - Data fim: `27/11/2025`
   - Hora fim: `21:00`
4. Verifique:

### No Console (F12):
```json
{
  "start_datetime": "2025-11-27T20:00:00-03:00",
  "end_datetime": "2025-11-27T21:00:00-03:00"
}
```

### No Supabase (SQL):
```sql
SELECT 
  patient_name,
  start_datetime,
  start_datetime AT TIME ZONE 'America/Sao_Paulo' as horario_sp
FROM appointments
ORDER BY start_datetime DESC
LIMIT 1;
```

**Resultado esperado:**
| patient_name | start_datetime | horario_sp |
|--------------|----------------|------------|
| João Silva | 2025-11-27 23:00:00+00 | 2025-11-27 20:00:00 |

## 📊 Tabela de Conversão

| Hora SP (Input) | ISO8601 com TZ | UTC (Banco) |
|-----------------|----------------|-------------|
| 20:00 | 2025-11-27T20:00:00-03:00 | 2025-11-27 23:00:00+00 |
| 21:00 | 2025-11-27T21:00:00-03:00 | 2025-11-28 00:00:00+00 |
| 08:00 | 2025-11-27T08:00:00-03:00 | 2025-11-27 11:00:00+00 |
| 14:30 | 2025-11-27T14:30:00-03:00 | 2025-11-27 17:30:00+00 |

**Regra**: Hora UTC = Hora SP + 3 horas

## 🔍 Debug

### Se ainda estiver errado:

1. **Limpe o cache do browser** (Ctrl + Shift + Delete)
2. **Recarregue a página** (Ctrl + F5)
3. **Crie um novo evento** de teste
4. **Abra o Console** e copie o payload completo
5. **Verifique no Supabase** com o SQL acima

### Verificar no N8N:

O N8N deve receber:
```json
{
  "start_datetime": "2025-11-27T20:00:00-03:00"
}
```

Para converter para horário local no N8N:
```javascript
const date = new Date($json.start_datetime);
const horarioSP = date.toLocaleString('pt-BR', { 
  timeZone: 'America/Sao_Paulo' 
});
// Resultado: "27/11/2025, 20:00:00"
```

---

**Status**: ✅ **Corrigido**

Última atualização: 25/11/2024

