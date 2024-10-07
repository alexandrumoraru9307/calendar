Creating Events
You can create a one-time event by providing a start date, end date, and a title:

```
import { Calendar } from './src/calendar';
import { Types } from './src/types';

const calendar: Calendar = new Calendar();
const duration:Types.Duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
const event = calendar.createEvent('Meeting', duration);

console.log(event);
```

Listing Events
To list all events in a calendar within a specified date range:

```
import { Calendar } from './src/calendar';

const calendar: Calendar = new Calendar();

const events = calendar.listEvents({
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
});

console.log(events);
```
Updating Events
You can update an existing event's details (start date, duration, and title) by its ID:

```
import { Calendar } from './src/calendar';
import { Types } from './src/types';

const calendar: Calendar = new Calendar();
const duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
const event = calendar.createEvent('New Year', duration);
const newDuration = new Types.Duration(new Date('2024-02-02'), new Date('2024-03-03'))
const newEvent = calendar.updateEvent(event[0].id, 'Bucharest', newDuration);

console.log(newEvent);
```

Deleting Events
To delete an event by its ID:

```
import { Calendar } from './calendar';

const calendar: Calendar = new Calendar();

calendar.deleteEvent('event-id');
```

Recurring Events
You can create recurring events by providing a recurrence rule. For example, to create a daily recurring event:

```
import { Calendar } from './src/calendar';
import { Types } from './src/types';

const calendar: Calendar = new Calendar();

const recurrenceRule: Types.RecurrenceRule = {
    frequency: 'daily',
    interval: 1,
    occurrences: 5,
};

const duration = new Types.Duration(new Date('2022-01-01'), new Date('2024-01-02'));
const recurringEvents = calendar.createEvent('Daily Standup', duration, false, recurrenceRule);
console.log(recurringEvents);
```

Development:

To build the project run:   

    ```
    npm run build
    ```

To test the project run:

    ```
    npm run test
    ```