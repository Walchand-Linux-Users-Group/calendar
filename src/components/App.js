import React, { Component } from 'react';
import { DateTime, } from 'luxon';
import { connect } from 'react-redux';
import { setMonth } from '../actions/ui/month';
import { submitReminder } from '../actions/ui/reminder';
import { getMonth } from '../selectors/ui/month';
import AppHeader from './AppHeader';
import { getMonthlyCalendarGrid, dateTimeStringsToMillis, millisToDateTimeStrings } from '../helpers/calendar';
import MonthlyCalendar from './calendar/MonthlyCalendar';
import ReminderContainer from './reminders/ReminderContainer';
import Axios from 'axios';

function setNavigationBarHeightCSSVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

class App extends Component {
  async componentDidMount() {
    window.addEventListener('resize', setNavigationBarHeightCSSVariable);

    if (this.props.month === null) {
      this.props.dispatch(setMonth(DateTime.local().toFormat('yyyy-MM')));
    }

    const data = getMonthlyCalendarGrid(DateTime.local().toFormat('yyyy-MM'));

    const first = data[0].key;
    const last = data[34].key;

    const minTime = dateTimeStringsToMillis(first,"00:00");
    const maxTime = dateTimeStringsToMillis(last,"23:59");

    const response = await Axios.post("https://calendar.wcewlug.org/api/get_remainder",{min: minTime, max: maxTime});
    console.log(response);
    for(const index in response.data) {
      const reminder = response.data[index];

      const reminderToSet = {
        ...millisToDateTimeStrings(reminder.dateTime),
        id: reminder.id,
        event_type: reminder.event_type,
        color: reminder.color,
        platform: reminder.platform,
        topic: reminder.topic,
      };

      this.props.dispatch(submitReminder({reminder: reminderToSet,init: true}));
    }

    // this.props.dispatch(submitReminder({reminder: {color: "indigo-600", ...millisToDateTimeStrings(1622546280000), event_type: "Club Service", id: "3d2po4axvsypp9iops3bzo", platform: "Google Meet", topic: "Meta"},init: true}));

    // this.props.dispatch(initReminders(DateTime.local().toFormat('yyyy-MM')));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', setNavigationBarHeightCSSVariable);
  }

  render() {
    return (
      <div className="h-screen-nav-fix w-screen font-montserrat overflow-hidden bg-gray-50 text-gray-900">
        <div className="w-full h-full flex flex-col">
          <AppHeader />
          <MonthlyCalendar />
          <ReminderContainer />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    ...props,
    month: getMonth(state),
  };
}

export default connect(mapStateToProps)(App);
