import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import './vi.js';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const getTimeAgo = (time: Date | string) => {
  const inputDate = dayjs(time); // local time
  const diffDays = dayjs().diff(inputDate, 'day');

  if (diffDays > 7) {
    return inputDate.format('DD/MM/YYYY');
  }

  return inputDate.fromNow();
};

export const getDateTime = (time?: Date | string, isGetDay?: boolean) => {
  if (!time) return '';
  return isGetDay ? dayjs(time).format('DD/MM/YYYY hh:mm') : dayjs(time).format('DD/MM/YYYY hh:mm A');
};

export const getDate = (time?: Date | string) => {
  if (!time) return '';
  return dayjs(time).format('DD/MM/YYYY');
};

export const checkNowYear = (date?: Date, year?: number) => {
  const parsedDate = date ? dayjs(date) : dayjs();

  if (!parsedDate.isValid()) {
    return false;
  }

  if (parsedDate.year() !== year) {
    return false;
  }

  return true;
};

export const getMonthRangeForYear = (startDate: Date, endDate: Date, year: number) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (year < start.year() || year > end.year()) {
    return { start: 0, end: 0 };
  }

  const startMonth = start.year() === year ? start.month() : 0;
  const endMonth = end.year() === year ? end.month() : 11;

  return { start: startMonth, end: endMonth };
};

export function getDayOffsetPx(date: dayjs.Dayjs, monthWidths: number[], dayWidth: number) {
  const monthIdx = date.month();
  const dayOfMonth = date.date();
  const widthBeforeMonth = monthWidths.slice(0, monthIdx).reduce((a, b) => a + b, 0);
  return widthBeforeMonth + (dayOfMonth - 1) * dayWidth;
}

export const isSameDateTime = (createdAt: Date | string, updatedAt: Date | string): boolean => {
  const created = dayjs(createdAt);
  const updated = dayjs(updatedAt);

  // So sánh chính xác đến giây
  return created.isSame(updated);
};

export const getTimeDate = (time?: Date | string) => {
  if (!time) return '';
  return dayjs(time).format('hh:mm DD/MM/YYYY');
};

// Hàm kiểm tra xem string có phải là date không
export const isDateString = (value: any): boolean => {
  if (typeof value !== 'string') return false;

  // Kiểm tra các pattern date phổ biến
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO format
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
  ];

  return datePatterns.some((pattern) => pattern.test(value));
};

export const formatTimeChat = (date: Date | string) => {
  const inputDate = dayjs(date);
  const diffInHours = dayjs().diff(inputDate, 'hour');

  if (diffInHours < 24) {
    return inputDate.format('HH:mm');
  } else if (diffInHours < 168) {
    // 7 days
    const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return weekdays[inputDate.day()];
  } else {
    return inputDate.format('DD/MM/YYYY');
  }
};
