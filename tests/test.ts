import { Calendar } from '../src/calendar';
import { Types } from '../src/types';
import CalendarEvent = Types.CalendarEvent;


describe('Calendar', (): void => {
    let calendar: Calendar;

    beforeEach((): void => {
        jest.resetModules()
        calendar = new Calendar();
    });

    test('create event without overlap', (): void => {
        const duration: Types.Duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        const event: Types.CalendarEvent[] = calendar.createEvent('New Year', duration);
        expect(event[0].title).toBe('New Year');
    });

    test('fail to create overlapping events', (): void => {
        const duration1: Types.Duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        calendar.createEvent('New Year', duration1);

        const duration2: Types.Duration = new Types.Duration(new Date('2024-01-01T12:00:00'), new Date('2024-01-02'));
        expect((): Types.CalendarEvent[] => calendar.createEvent('Overlap Event', duration2)).toThrow('Event overlaps with an existing event!');
    });

    test('create overlapping events', (): void => {
        const duration1: Types.Duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        calendar.createEvent('New Year', duration1);

        const duration2: Types.Duration = new Types.Duration(new Date('2024-01-01T12:00:00'), new Date('2024-01-02'));
        expect((): Types.CalendarEvent[] => calendar.createEvent('Overlap Event', duration2, true)).not.toThrow('Event overlaps with an existing event!');
    });

    test('list events in a date range', (): void => {
        const duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        calendar.createEvent('New Year', duration);

        const events = calendar.listEvents({ start: new Date('2024-01-01'), end: new Date('2024-01-03') });
        expect(events.length).toBe(1);
    });

    test('delete event', (): void => {
        const duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        const event = calendar.createEvent('New Year', duration);

        calendar.deleteEvent(event[0].id);
        expect(() => calendar.deleteEvent(event[0].id)).toThrow(`Event with ID ${event[0].id} not found!`);
    });

    test('update event', (): void => {
        const duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        const event = calendar.createEvent('New Year', duration);

        const newDuration = new Types.Duration(new Date('2024-02-02'), new Date('2024-03-03'))

        const newEvent = calendar.updateEvent(event[0].id, 'Bucharest', newDuration);

        expect(newEvent.id).toBe(event[0].id);
        expect(newEvent.title).toBe('Bucharest');
        expect(newEvent.duration).toBe(newDuration);
    });

    test('create daily recurring event', () => {
        const duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        const recurrenceRule: Types.RecurrenceRule = {
            frequency: 'daily',
            interval: 1,
            occurrences: 3
        };

        const events = calendar.createEvent('Daily Event', duration, false, recurrenceRule);
        expect(events.length).toBe(4); // 1 original + 3 recurring events
    });

    test('list recurring events in a date range', () => {
        const duration = new Types.Duration(new Date('2024-01-01'), new Date('2024-01-02'));
        const recurrenceRule: Types.RecurrenceRule = {
            frequency: 'daily',
            interval: 1,
            occurrences: 5
        };

        calendar.createEvent('Daily Event', duration, false, recurrenceRule);

        const events: CalendarEvent[] = calendar.listEvents({
            start: new Date('2024-01-01'),
            end: new Date('2024-01-04'),
        });
        expect(events.length).toBe(4);
    });

    test('delete future occurrences of a recurring event', () => {
        let nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);


        const duration = new Types.Duration(new Date(), nextDate);
        const recurrenceRule: Types.RecurrenceRule = {
            frequency: 'daily',
            interval: 1,
            occurrences: 5
        };

        const events = calendar.createEvent('Daily Event', duration, false, recurrenceRule);
        const parentId = events[0].id;

        calendar.deleteEvent(parentId);

        const remainingEvents = calendar.listEvents({
            start: new Date('2024-01-01'),
            end: new Date('2024-10-20'),
        });

        expect(remainingEvents.length).toBe(1);
    });
});