import { addDays, addWeeks, addMonths, parseISO } from 'date-fns';
import { RecurringRule } from './types';

export function calculateNextRun(rule: RecurringRule): Date {
  const now = new Date();
  
  switch (rule.schedule_type) {
    case 'daily':
      return addDays(now, parseInt(rule.schedule_value) || 1);
    
    case 'weekly':
      return addWeeks(now, parseInt(rule.schedule_value) || 1);
    
    case 'monthly':
      return addMonths(now, parseInt(rule.schedule_value) || 1);
    
    case 'custom':
      // For custom cron, we'll use a simple parser
      // Format: "0 9 * * 1" (every Monday at 9am)
      return parseCronExpression(rule.schedule_value);
    
    default:
      return addDays(now, 1);
  }
}

function parseCronExpression(cronExpr: string): Date {
  // Simple cron parser for common patterns
  // Format: minute hour day month weekday
  const parts = cronExpr.split(' ');
  
  if (parts.length !== 5) {
    // Fallback to daily if invalid
    return addDays(new Date(), 1);
  }

  const [minute, hour, day, month, weekday] = parts;
  const now = new Date();
  let next = new Date(now);

  // Set time if specified
  if (hour !== '*') {
    next.setHours(parseInt(hour), parseInt(minute || '0'), 0, 0);
  }

  // If the time has passed today, move to tomorrow
  if (next <= now) {
    next = addDays(next, 1);
  }

  // Handle weekly pattern (weekday specified)
  if (weekday !== '*') {
    const targetDay = parseInt(weekday);
    const currentDay = next.getDay();
    const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
    next = addDays(next, daysToAdd);
  }

  // Handle monthly pattern (day specified)
  if (day !== '*') {
    next.setDate(parseInt(day));
    if (next <= now) {
      next = addMonths(next, 1);
    }
  }

  return next;
}

export function generateScheduleDescription(rule: RecurringRule): string {
  switch (rule.schedule_type) {
    case 'daily':
      const days = parseInt(rule.schedule_value) || 1;
      return days === 1 ? 'Every day' : `Every ${days} days`;
    
    case 'weekly':
      const weeks = parseInt(rule.schedule_value) || 1;
      return weeks === 1 ? 'Every week' : `Every ${weeks} weeks`;
    
    case 'monthly':
      const months = parseInt(rule.schedule_value) || 1;
      return months === 1 ? 'Every month' : `Every ${months} months`;
    
    case 'custom':
      return `Custom: ${rule.schedule_value}`;
    
    default:
      return 'Unknown schedule';
  }
}

export function validateCronExpression(cronExpr: string): boolean {
  const parts = cronExpr.split(' ');
  
  if (parts.length !== 5) return false;
  
  // Basic validation - you could make this more robust
  return parts.every(part => {
    if (part === '*') return true;
    const num = parseInt(part);
    return !isNaN(num) && num >= 0;
  });
}
