import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormTextInput from '../shared/forms/FormTextInput';
import FormDatePicker from '../shared/forms/FormDatePicker';
import FormErrorMessage from '../shared/forms/FormErrorMessage';
import FormLabel from '../shared/forms/FormLabel';
import FormFieldset from '../shared/forms/FormFieldset';
import BaseButton from '../shared/buttons/BaseButton';
import FormActions from '../shared/forms/FormActions';
import CheckIcon from '../icons/CheckIcon';
import {
  DATE_FORMAT,
  DATE_REGEX,
  TIME_FORMAT,
  TIME_REGEX,
} from '../../helpers/calendar';
import FormTimePicker from '../shared/forms/FormTimePicker';
import ReminderColorPicker from './ReminderColorPicker';
import { ALL_COLORS } from '../../helpers/colors';
import { ReminderPropType } from '../shared/prop-types/reminder';

const ReminderSchema = Yup.object().shape({
  event_type: Yup.string()
    .max(30, 'No more than 30 character, please.')
    .required('Please enter Event Type (max. 30 characters).'),
  topic: Yup.string()
    .max(30, 'No more than 30 character, please.')
    .required('Please enter Event Topic (max. 30 characters).'),
  color: Yup.string()
    .oneOf(ALL_COLORS, 'Color is invalid.')
    .required('Please inform a color.'),
  date: Yup.string()
    .matches(DATE_REGEX, `Date must be valid (${DATE_FORMAT}).`)
    .required('Please inform the day you want to get reminded.'),
  time: Yup.string()
    .matches(TIME_REGEX, `Time must be valid (${TIME_FORMAT}).`)
    .required('Please inform the time of the day you want to get reminded.'),
  platform: Yup.string()
    .max(30, 'No more than 30 character, please.')
    .required('Please enter Event platform (max. 30 characters).'),
});

class ReminderForm extends Component {
  static propTypes = {
    reminder: ReminderPropType.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  getInitialValues = () => {
    const { event_type, color,topic, date, time, platform } = this.props.reminder;

    return {
      event_type,
      color,
      topic,
      date,
      time,
      platform,
    };
  };

  handleSubmit = (values) => {
    var idVal = this.props.reminder.id;

    if(values.init!=null){
      idVal = values.id;
    }

    this.props.onSubmit({
      id: idVal,
      event_type: values.event_type,
      color: values.color,
      topic: values.topic,
      platform: values.platform,
      date: values.date,
      time: values.time,
    });
  };

  render() {
    return (
      <Formik
        initialValues={this.getInitialValues()}
        validationSchema={ReminderSchema}
        onSubmit={this.handleSubmit}
      >
        <Form className="w-full flex flex-col gap-3">
          <FormFieldset>
            <FormLabel htmlFor="event_type">
              Event Type
            </FormLabel>
            <div className="flex flex-row flex-wrap gap-2">
              <Field
                id="event_type"
                name="event_type"
                component={FormTextInput}
                placeholder="e.g.: Club Service"
                className="flex-grow"
              />
              <Field
                name="color"
                as={ReminderColorPicker}
                className="flex-shrink"
              />
            </div>
            <ErrorMessage component={FormErrorMessage} name="event_type" />
            <ErrorMessage component={FormErrorMessage} name="color" />
          </FormFieldset>

          <FormFieldset>
            <FormLabel htmlFor="topic">Topic</FormLabel>
            <Field
              id="topic"
              name="topic"
              component={FormTextInput}
              placeholder="e.g.: Metamorphosis"
            />
            <ErrorMessage component={FormErrorMessage} name="topic" />
          </FormFieldset>

          <FormFieldset>
            <FormLabel htmlFor="date">When?</FormLabel>

            <div className="flex flex-row flex-wrap gap-2">
              <Field
                id="date"
                name="date"
                component={FormDatePicker}
                className="flex-grow"
              />
              <Field
                id="time"
                name="time"
                component={FormTimePicker}
                className="w-full sm:w-44"
              />
            </div>
            <ErrorMessage component={FormErrorMessage} name="date" />
            <ErrorMessage component={FormErrorMessage} name="time" />
          </FormFieldset>

          <FormFieldset>
            <FormLabel htmlFor="platform">Platform</FormLabel>
            <Field
              id="platform"
              name="platform"
              component={FormTextInput}
              placeholder="e.g.: Google Meet"
            />
            <ErrorMessage component={FormErrorMessage} name="platform" />
          </FormFieldset>

          <FormActions>
            <BaseButton
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-500 text-white"
            >
              <CheckIcon svgClassName="w-6 h-6" />
              Confirm
            </BaseButton>
          </FormActions>
        </Form>
      </Formik>
    );
  }
}

export default ReminderForm;
