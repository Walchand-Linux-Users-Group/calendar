import PropTypes from 'prop-types';
import { ALL_COLORS } from '../../../helpers/colors';

export const ReminderPropType = PropTypes.shape({
  id: PropTypes.string,
  event_type: PropTypes.string.isRequired,
  color: PropTypes.oneOf(ALL_COLORS).isRequired,
  topic: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
});
