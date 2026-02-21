import { addDays, addWeeks, addMonths } from 'date-fns';
import { RecurringRule } from './types';

const VALID_SCHEDULE_TYPES = ['daily', 'weekly', 'monthly', 'custom'] as const;

export function calculateNextRun(rule: Pick<RecurringRule, 'schedule_type' | 'schedule_value'>): Date {
  const now = new Date();

  switch (rule.schedule_type) {
    case 'daily': {
      const n = parseInt(rule.schedule_value);
      return addDays(now, (isNaN(n) || n < 1) ? 1 : n);
    }
    case 'weekly': {
      const n = parseInt(rule.schedule_value);
      return addWeeks(now, (isNaN(n) || n < 1) ? 1 : n);
    }
    case 'monthly': {
      const n = parseInt(rule.schedule_value);
      return addMonths(now, (isNaN(n) || n < 1) ? 1 : n);
    }
    case 'custom':
      return parseCronExpression(rule.schedule_value);

    default:
      return addDays(now, 1);
  }
}

function parseCronExpression(cronExpr: string): Date {
  const parts = cronExpr.trim().split(/\s+/);

  if (parts.length !== 5) {
    return addDays(new Date(), 1);
  }

  const [minuteStr, hourStr, dayStr, , weekdayStr] = parts;
  const now = new Date();
  let next = new Date(now);

  // Set time if hour is specified
  const hour = hourStr !== '*' ? parseInt(hourStr) : NaN;
  const minute = minuteStr !== '*' ? parseInt(minuteStr) : 0;

  if (!isNaN(hour) && hour >= 0 && hour <= 23) {
    const min = (!isNaN(minute) && minute >= 0 && minute <= 59) ? minute : 0;
    next.setHours(hour, min, 0, 0);
  }

  // If the time has passed today, move to tomorrow
  if (next <= now) {
    next = addDays(next, 1);
  }

  // Handle weekly pattern (weekday specified)
  if (weekdayStr !== '*') {
    const targetDay = parseInt(weekdayStr);
    if (!isNaN(targetDay) && targetDay >= 0 && targetDay <= 6) {
      const currentDay = next.getDay();
      const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
      next = addDays(next, daysToAdd);
    }
  }

  // Handle monthly pattern (day of month specified) — only if weekday is not set
  if (dayStr !== '*' && weekdayStr === '*') {
    const targetDate = parseInt(dayStr);
    if (!isNaN(targetDate) && targetDate >= 1 && targetDate <= 31) {
      next.setDate(targetDate);
      if (next <= now) {
        next = addMonths(next, 1);
      }
    }
  }

  return next;
}

export function generateScheduleDescription(rule: Pick<RecurringRule, 'schedule_type' | 'schedule_value'>): string {
  switch (rule.schedule_type) {
    case 'daily': {
      const days = parseInt(rule.schedule_value) || 1;
      return days === 1 ? 'Every day' : `Every ${days} days`;
    }
    case 'weekly': {
      const weeks = parseInt(rule.schedule_value) || 1;
      return weeks === 1 ? 'Every week' : `Every ${weeks} weeks`;
    }
    case 'monthly': {
      const months = parseInt(rule.schedule_value) || 1;
      return months === 1 ? 'Every month' : `Every ${months} months`;
    }
    case 'custom':
      return `Custom: ${rule.schedule_value}`;

    default:
      return 'Unknown schedule';
  }
}

const CRON_RANGES: [number, number][] = [
  [0, 59],  // minute
  [0, 23],  // hour
  [1, 31],  // day of month
  [1, 12],  // month
  [0, 6],   // weekday
];

export function validateCronExpression(cronExpr: string): boolean {
  const parts = cronExpr.trim().split(/\s+/);

  if (parts.length !== 5) return false;

  return parts.every((part, i) => {
    if (part === '*') return true;
    const num = parseInt(part);
    if (isNaN(num)) return false;
    const [min, max] = CRON_RANGES[i];
    return num >= min && num <= max;
  });
}

export function validateSchedule(scheduleType: string, scheduleValue: string): string | null {
  if (!VALID_SCHEDULE_TYPES.includes(scheduleType as any)) {
    return `Invalid schedule type. Must be one of: ${VALID_SCHEDULE_TYPES.join(', ')}`;
  }

  if (scheduleType === 'custom') {
    if (!validateCronExpression(scheduleValue)) {
      return 'Invalid cron expression. Use format: minute hour day month weekday (e.g. "0 9 * * 1")';
    }
  } else {
    const n = parseInt(scheduleValue);
    if (isNaN(n) || n < 1 || n > 365) {
      return 'Interval must be a number between 1 and 365';
    }
  }

  return null;
}
