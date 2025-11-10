/**
 * Форматирует дату в читаемый формат на русском языке
 * @param dateString - строка даты в формате ISO 8601 (например, "2025-11-09T15:40:24.786717Z")
 * @returns отформатированная дата (например, "9 ноября 2025, 15:40")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return dateString; // Возвращаем исходную строку, если дата невалидна
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Если прошло меньше минуты
    if (diffInSeconds < 60) {
      return 'только что';
    }
    
    // Если прошло меньше часа
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${getMinutesWord(minutes)} назад`;
    }
    
    // Если прошло меньше суток
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${getHoursWord(hours)} назад`;
    }
    
    // Если прошло меньше недели
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${getDaysWord(days)} назад`;
    }
    
    // Для более старых дат показываем полную дату
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    return `${day} ${monthNames[month]} ${year}, ${hours}:${minutes}`;
  } catch (error) {
    return dateString;
  }
};

/**
 * Получить правильную форму слова "минута"
 */
const getMinutesWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'минут';
  }
  
  if (lastDigit === 1) {
    return 'минуту';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'минуты';
  }
  
  return 'минут';
};

/**
 * Получить правильную форму слова "час"
 */
const getHoursWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'часов';
  }
  
  if (lastDigit === 1) {
    return 'час';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'часа';
  }
  
  return 'часов';
};

/**
 * Получить правильную форму слова "день"
 */
const getDaysWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'дней';
  }
  
  if (lastDigit === 1) {
    return 'день';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }
  
  return 'дней';
};


