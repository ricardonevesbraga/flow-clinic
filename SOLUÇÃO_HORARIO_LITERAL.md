# 🔧 Solução: Horário Literal no Banco

## 🎯 Objetivo

Fazer o banco armazenar **exatamente** o horário que foi digitado, não o UTC.

**Exemplo:**
- Você digita: **09:00**
- Banco mostra: **09:00:00+00** ✅ (não mais 12:00:00+00)

## 🛠️ Como Funciona

### HACK Implementado

Quando você digita `09:00`:

1. **Sistema subtrai 3 horas**: 09:00 - 3h = 06:00
2. **Envia para Supabase**: `2025-11-25T06:00:00-03:00`
3. **Postgres converte para UTC**: 06:00 + 3h = 09:00 UTC
4. **Banco armazena**: `09:00:00+00` ✅

**Resultado:** O horário no banco é **literalmente** o que você digitou!

## 🧪 Teste Agora

### 1. Recarregue a Página

Pressione **Ctrl + F5**

### 2. Crie um Compromisso

- Data: **25/11/2025**
- Hora início: **09:00**
- Hora fim: **10:00**

### 3. Verifique no Console (F12)

```
🕐 Horários digitados: { start: "2025-11-25 09:00", end: "2025-11-25 10:00" }
📤 ISO8601 gerado: { 
  startISO: "2025-11-25T06:00:00-03:00",  ← Subtraiu 3h
  endISO: "2025-11-25T07:00:00-03:00" 
}
💾 Dados gravados no Supabase: {
  start_datetime: "2025-11-25T09:00:00+00:00",  ← Mostra 09:00! ✅
  end_datetime: "2025-11-25T10:00:00+00:00"
}
```

### 4. Verifique no Supabase

```sql
SELECT 
  patient_name,
  start_datetime,
  end_datetime
FROM appointments
ORDER BY created_at DESC
LIMIT 1;
```

**Resultado esperado:**

| patient_name | start_datetime | end_datetime |
|--------------|----------------|--------------|
| João Silva | **2025-11-25 09:00:00+00** | **2025-11-25 10:00:00+00** |

✅ **09:00 no banco!** (não mais 12:00)

## 📤 Webhook

O webhook continua recebendo o horário ORIGINAL:

```json
{
  "start_datetime": "2025-11-25T09:00:00-03:00",  ← Horário de SP
  "end_datetime": "2025-11-25T10:00:00-03:00"
}
```

**Para ajustar o webhook também:**

Se você quiser que o webhook receba o horário "literal" também, podemos mudar.

## ⚠️ Importante

### Dashboard e Agenda

Agora que o banco armazena horário "literal", o Dashboard e Agenda vão:

1. Ler: `2025-11-25T09:00:00+00:00`
2. Interpretar como UTC
3. Converter para seu timezone: 09:00 - 3h = **06:00**

**Problema:** Vai mostrar **06:00** ao invés de **09:00**!

### Solução

Precisamos também ajustar o Dashboard/Agenda para NÃO converter, já que o horário no banco agora é "literal".

Quer que eu ajuste isso também?

## 🤔 Recomendação

**Esta não é a melhor prática**, mas se é o que você precisa, funciona!

**Problemas potenciais:**
- ❌ Se mudar timezone do servidor, vai quebrar
- ❌ Se integrar com sistemas externos, vai confundir
- ❌ Horário de verão pode causar problemas
- ❌ Relatórios por timezone ficam complexos

**Alternativa recomendada:**
- ✅ Deixar o banco em UTC (correto)
- ✅ Apenas exibir convertido na tela
- ✅ Padrão usado por Google, Microsoft, etc

Mas se você prefere assim, está implementado! 👍

---

**Teste agora e confirme que o banco mostra 09:00!** 🚀

