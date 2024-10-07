import { Types } from './types';
import { Errors } from './errors';
import Duration = Types.Duration;
import CalendarEvent = Types.CalendarEvent;

export class Calendar {
    private events: Types.CalendarEvent[] = [];

    public createEvent(title: string, duration: Types.Duration, allowOverlap: boolean = false, recurrenceRule?: Types.RecurrenceRule): Types.CalendarEvent[] {
        if (!allowOverlap && this.hasOverlap(duration)) {
            throw new Errors.EventOverlapError();
        }

        const newEvent: Types.CalendarEvent = {
            id: this.generateId(),
            title,
            duration,
            isRecurring: !!recurrenceRule,
            recurrenceRule,
        };

        this.events.push(newEvent);

        if (!recurrenceRule) {
            return [newEvent];
        }

        const recurringEvents = this.generateRecurringEvents(newEvent, recurrenceRule);
        this.events.push(...recurringEvents);
        return [newEvent, ...recurringEvents];
    }

    private generateRecurringEvents(event: CalendarEvent, rule: Types.RecurrenceRule): CalendarEvent[] {
        const events: CalendarEvent[] = [];
        let nextStart = event.duration.start;
        let count = 0;

        while (
            (!rule.until || nextStart <= rule.until) &&
            (!rule.occurrences || count < rule.occurrences)
            ) {
            count++;
            nextStart = this.calculateNextDate(nextStart, rule);

            const nextEnd = new Date(
                nextStart.getTime() + (event.duration.end.getTime() - event.duration.start.getTime())
            );

            if (nextEnd > rule.until!) break; // Stop if next instance exceeds "until" date

            events.push({
                ...event,
                id: this.generateId(),
                duration: new Duration(nextStart, nextEnd),
                parentEventId: event.id,
            });
        }

        return events;
    }

    private calculateNextDate(currentDate: Date, rule: Types.RecurrenceRule): Date {
        const nextDate = new Date(currentDate);
        switch (rule.frequency) {
            case 'daily':
                nextDate.setDate(currentDate.getDate() + rule.interval);
                break;
            case 'weekly':
                nextDate.setDate(currentDate.getDate() + 7 * rule.interval);
                break;
            case 'monthly':
                nextDate.setMonth(currentDate.getMonth() + rule.interval);
                break;
        }
        return nextDate;
    }

    public listEvents(range: Types.DateRange): CalendarEvent[] {
        return this.events.filter((event) =>
            event.duration.overlaps(new Duration(range.start, range.end))
        );
    }

    public updateRecurringEvent(id: Types.EventID, newRule: Types.RecurrenceRule): CalendarEvent[] {
        const event = this.findEvent(id);
        if (!event.isRecurring) {
            throw new Error('Event is not recurring');
        }

        const futureInstances = this.events.filter(e => e.parentEventId === id && e.duration.start > new Date());
        this.events = this.events.filter(e => !(e.parentEventId === id && e.duration.start > new Date()));

        const updatedRecurringEvents = this.generateRecurringEvents(event, newRule);
        this.events.push(...updatedRecurringEvents);
        return updatedRecurringEvents;
    }

    public deleteEvent(id: Types.EventID): void {
        const event = this.findEvent(id);

        if (event.isRecurring) {
            this.events = this.events.filter(e => !(e.parentEventId === id && e.duration.start > new Date()));
        } else {
            this.events = this.events.filter(e => e.id !== id);
        }
    }


    public updateEvent(id: Types.EventID, newTitle: string, newDuration: Types.Duration, allowOverlap: boolean = false): Types.CalendarEvent {
        const event: Types.CalendarEvent = this.findEvent(id);
        if (!allowOverlap && this.hasOverlap(newDuration, id)) {
            throw new Errors.EventOverlapError();
        }

        event.title = newTitle;
        event.duration = newDuration;
        return event;
    }

    private hasOverlap(newDuration: Types.Duration, excludeId?: Types.EventID): boolean {
        return this.events.some(event =>
            event.duration.overlaps(newDuration) && event.id !== excludeId
        );
    }

    public findEvent(id: Types.EventID): Types.CalendarEvent {
        const event: Types.CalendarEvent = this.events.filter(event => event.id === id)[0];
        if (!event) {
            throw new Errors.EventNotFoundError(id);
        }
        return event;
    }

    public findEventByTitle(title: string): Types.CalendarEvent {
        const event: Types.CalendarEvent = this.events.filter(event => event.title === title)[0];
        if (!event) {
            throw new Errors.EventNotFoundError(undefined, title);
        }
        return event;
    }

    private generateId(): Types.EventID {
        return (Math.random() * 1000000).toString(16);
    }
}