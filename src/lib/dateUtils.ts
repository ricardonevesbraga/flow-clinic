/**
 * Utilitários para manipulação de datas com timezone de São Paulo
 */

/**
 * Converte data e hora para formato ISO8601 com timezone de São Paulo
 * Agora o banco armazena como TEXT, então o formato é preservado literalmente
 * @param date - Data no formato YYYY-MM-DD (já no horário de São Paulo)
 * @param time - Hora no formato HH:MM (já no horário de São Paulo)
 * @returns String ISO8601 com timezone -03:00 (formato literal)
 */
export function toSaoPauloISO(date: string, time: string): string {
  // Formato ISO8601 direto, sem conversões
  // O banco agora armazena como TEXT, então o que enviamos é o que fica
  return `${date}T${time}:00-03:00`;
}

/**
 * Formata datetime para exibição
 * @param datetime - String ISO8601
 * @returns String formatada para exibição (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(datetime: string): string {
  const date = new Date(datetime);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formata apenas a hora de um datetime
 * IMPORTANTE: Extrai hora literal do banco, SEM conversão de timezone
 * @param datetime - String ISO8601 ou timestamp
 * @returns String formatada (HH:MM)
 */
export function formatTime(datetime: string | null): string {
  if (!datetime) return '--:--';
  
  // Extrair hora/minuto DIRETAMENTE da string, sem conversão
  // Exemplo: "2025-11-25T09:00:00+00:00" -> "09:00"
  const match = datetime.match(/T(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  
  // Fallback para método antigo
  const date = new Date(datetime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Verifica se uma data é hoje
 * IMPORTANTE: Compara data literal do banco, SEM conversão de timezone
 * @param datetime - String ISO8601 ou timestamp
 * @returns Boolean
 */
export function isToday(datetime: string | null): boolean {
  if (!datetime) return false;
  
  // Extrair data DIRETAMENTE da string, sem conversão
  // Exemplo: "2025-11-25T09:00:00+00:00" -> "2025-11-25"
  const dateMatch = datetime.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const year = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]);
    const day = parseInt(dateMatch[3]);
    
    const today = new Date();
    return year === today.getFullYear() &&
           month === (today.getMonth() + 1) &&
           day === today.getDate();
  }
  
  // Fallback para método antigo
  const date = new Date(datetime);
  const today = new Date();
  
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

/**
 * Compara datas (ignora hora)
 * @param datetime - String ISO8601 ou timestamp
 * @param compareDate - Date para comparar
 * @returns Boolean
 */
export function isSameDay(datetime: string | null, compareDate: Date): boolean {
  if (!datetime) return false;
  
  const date = new Date(datetime);
  
  return date.getFullYear() === compareDate.getFullYear() &&
         date.getMonth() === compareDate.getMonth() &&
         date.getDate() === compareDate.getDate();
}

/**
 * Calcula duração entre duas datas
 * @param start - Data/hora início
 * @param end - Data/hora fim
 * @returns Duração em minutos
 */
export function getDurationMinutes(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}

/**
 * Adiciona minutos a uma data/hora
 * @param dateTime - Data/hora base
 * @param minutes - Minutos para adicionar
 * @returns Nova data/hora
 */
export function addMinutes(dateTime: string, minutes: number): Date {
  const date = new Date(dateTime);
  return new Date(date.getTime() + (minutes * 60 * 1000));
}

