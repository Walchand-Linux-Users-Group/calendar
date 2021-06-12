import { createSelector } from 'reselect';
import { millisToDateTimeStrings } from '../../helpers/calendar';

export const getReminder = (state) => state.ui.reminder;

export const getFormattedReminder = createSelector(
  [getReminder],
  (reminder) => {
    if (!reminder) return null;

    return {
      id: reminder.id,
      event_type: reminder.event_type,
      color: reminder.color,
      platform: reminder.platform,
      topic: reminder.topic,
      ...millisToDateTimeStrings(reminder.dateTime),
    };
  }
);
