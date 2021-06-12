export const SET_REMINDER = 'SET_REMINDER';
export const INIT_REMINDERS = 'INIT_REMINDERS';

export function setReminder(reminder) {
  return {
    type: SET_REMINDER,
    payload: reminder,
  };
}

export function initReminders(month) {
  return {
    type: INIT_REMINDERS,
    payload: month,
  };
}
