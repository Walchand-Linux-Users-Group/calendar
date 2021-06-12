import { DateTime } from 'luxon';
import { apply, call, put, takeEvery } from 'redux-saga/effects';
import { setDateReminder } from '../../actions/dates';
import { setReminder } from '../../actions/reminders';
import * as reminderUIActions from '../../actions/ui/reminder';
import { dateTimeStringsToMillis, DATE_FORMAT } from '../../helpers/calendar';
import { DEFAULT_COLOR } from '../../helpers/colors';
import { generateUUID } from '../../helpers/uuid';
import Axios from 'axios';

export function* openReminder(reminder) {
  yield put(reminderUIActions.openReminder(reminder));
}

export function* newReminder(action) {
  const initialDate = action.payload;
  let initialDateTime = yield apply(DateTime, 'local');

  if (initialDate) {
    const parsed = DateTime.fromFormat(initialDate, DATE_FORMAT);
    if (parsed.isValid) {
      initialDateTime = initialDateTime.set({
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
      });
    }
  }

  const initialColor = DEFAULT_COLOR;

  const reminder = {
    id: null,
    event_type: '',
    color: initialColor,
    dateTime: initialDateTime.toMillis(),
    platform: '',
    topic: '',
  };

  yield call(openReminder, reminder);
}

export function* editReminder(action) {
  yield call(openReminder, action.payload);
}

export function* submitReminder(action) {
  const reminder = action.payload;
  let id = reminder.id;
  
  if (!id) {
    id = yield call(generateUUID);
  }

  const reminderToSet = {
    id,
    event_type: reminder.event_type,
    color: reminder.color,
    dateTime: dateTimeStringsToMillis(reminder.date, reminder.time),
    platform: reminder.platform,
    topic: reminder.topic,
  };

  const dateReminder = { date: reminder.date, reminderId: reminderToSet.id };

  // TODO: Save do IDB (with dexie)

  yield put(setReminder(reminderToSet));
  yield put(setDateReminder(dateReminder));

  yield put(reminderUIActions.closeReminder());

  /*
    API call to update te content
  */

  Axios.post("http://localhost:5000/api/set_remainder",reminderToSet).then(function (response) {
    console.log(response);
  })

  console.log(reminderToSet);
}

export function* watchNewReminder() {
  yield takeEvery(reminderUIActions.NEW_REMINDER, newReminder);
}

export function* watchEditReminder() {
  yield takeEvery(reminderUIActions.EDIT_REMINDER, editReminder);
}

export function* watchSubmitReminder() {
  yield takeEvery(reminderUIActions.SUBMIT_REMINDER, submitReminder);
}
