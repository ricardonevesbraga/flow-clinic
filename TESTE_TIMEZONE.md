# 🔍 Teste de Timezone - Debug

## 🧪 Como Testar

### 1. Criar Compromisso

1. Acesse http://localhost:5173/agenda
2. Clique em "Novo Evento"
3. Preencha:
   - **Data início**: 26/11/2025
   - **Hora início**: 10:00
   - **Data fim**: 26/11/2025
   - **Hora fim**: 11:00
4. Clique em "Criar Compromisso"

### 2. Ver Console (F12)

Procure por:

```
🕐 Horários digitados: {
  start: "2025-11-26 10:00",
  end: "2025-11-26 11:00"
}

📤 ISO8601 gerado: {
  startISO: "2025-11-26T10:00:00-03:00",
  endISO: "2025-11-26T11:00:00-03:00"
}

✅ Webhook disparado com sucesso
```

### 3. Verificar no Supabase

Execute no SQL Editor:

```sql
SELECT 
  patient_name,
  start_datetime,
  end_datetime,
  start_datetime AT TIME ZONE 'America/Sao_Paulo' as horario_sp_inicio,
  end_datetime AT TIME ZONE 'America/Sao_Paulo' as horario_sp_fim,
  start_datetime AT TIME ZONE 'UTC' as horario_utc_inicio
FROM appointments
ORDER BY created_at DESC
LIMIT 1;
```

## ✅ Resultado ESPERADO

### Console:
```
startISO: "2025-11-26T10:00:00-03:00"
endISO: "2025-11-26T11:00:00-03:00"
```

### Supabase (Coluna start_datetime):
```
2025-11-26 13:00:00+00  ← UTC (10:00 SP + 3h = 13:00 UTC) ✅
```

### Supabase (Consulta com timezone):

| horario_sp_inicio | horario_sp_fim | horario_utc_inicio |
|-------------------|----------------|--------------------|
| 2025-11-26 10:00:00 | 2025-11-26 11:00:00 | 2025-11-26 13:00:00 |

## 🎯 O Que É CORRETO

### Armazenamento no Banco (UTC):
- ✅ `13:00:00+00` está **CORRETO**!
- É assim que deve ser: 10:00 (SP) = 13:00 (UTC)

### Por Que?

**São Paulo = UTC-3**
- Quando é 10:00 em São Paulo
- É 13:00 no UTC (horário de referência mundial)

**Conversão:**
```
10:00 (SP) + 3 horas = 13:00 (UTC) ✅
11:00 (SP) + 3 horas = 14:00 (UTC) ✅
```

### Mas Vai Exibir Correto!

Quando o Dashboard/Agenda LER do banco:

```javascript
const date = new Date("2025-11-26 13:00:00+00");
date.getHours(); // Retorna 10 (se navegador em São Paulo) ✅
```

O JavaScript **converte automaticamente** UTC → Horário Local!

## 🔍 Verificar Timezone do Navegador

Cole no Console (F12):

```javascript
// Ver timezone do seu navegador
console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

// Ver offset
const offset = new Date().getTimezoneOffset();
console.log('Offset em minutos:', offset);
console.log('Offset em horas:', -offset/60);

// Testar conversão
const utcDate = new Date("2025-11-26T13:00:00Z"); // UTC
console.log('UTC:', utcDate.toISOString());
console.log('Local:', utcDate.toLocaleString('pt-BR'));
```

### Resultado ESPERADO (São Paulo):
```
Timezone: America/Sao_Paulo
Offset em horas: -3
UTC: 2025-11-26T13:00:00.000Z
Local: 26/11/2025, 10:00:00
```

## ⚠️ Se o Resultado Estiver ERRADO

### Problema 1: Navegador não está em São Paulo

**Sintoma:**
```
Timezone: America/New_York  ← Errado!
Offset: -5
```

**Solução:** 
O sistema está funcionando corretamente, mas o navegador está configurado para outro timezone. Os horários serão exibidos conforme o timezone do navegador.

### Problema 2: ISO8601 Gerado Errado

**Sintoma no Console:**
```
startISO: "2025-11-26T13:00:00-03:00"  ← 13h ao invés de 10h
```

**Causa:** Bug na função `toSaoPauloISO`

**Solução:** Vou verificar e corrigir

### Problema 3: Webhook Recebe Errado

**Sintoma:**
```
Webhook: { start_datetime: "2025-11-26T13:00:00-03:00" }
```

**Causa:** O problema está antes de enviar

## 📝 Checklist

- [ ] Console mostra `10:00:00-03:00` (não 13:00)
- [ ] Banco mostra `13:00:00+00` (UTC)
- [ ] Consulta com timezone mostra `10:00` (SP)
- [ ] Dashboard exibe `10:00`
- [ ] Webhook recebe `10:00:00-03:00`

## 🐛 Se Ainda Estiver Errado

**Cole aqui o resultado completo do Console:**

```
🕐 Horários digitados: { ... }
📤 ISO8601 gerado: { ... }
✅ Webhook disparado com sucesso
📤 Payload: { ... }
```

E também:

```sql
SELECT 
  start_datetime,
  start_datetime AT TIME ZONE 'America/Sao_Paulo' as sp_time
FROM appointments
ORDER BY created_at DESC
LIMIT 1;
```

---

**Execute o teste e me envie os resultados do Console e do SQL!**

