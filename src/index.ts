import { Calendar } from './calendar';
import { Types } from './types';

const calendar: Calendar = new Calendar();
const duration1: Types.Duration = new Types.Duration(new Date('2017-01-01'), new Date('2022-01-01'));
const duration2: Types.Duration = new Types.Duration(new Date('2018-01-01'), new Date('2023-01-01'));

calendar.createEvent('event1', duration1);
calendar.createEvent('event2', duration2);

