import { Errors } from './errors';

export namespace Types {
    export type EventID = string;

    export class Duration {
        constructor(public readonly start: Date, public readonly end: Date) {
            if (end <= start) {
                throw new Errors.DateInvalidError();
            }
        }

        overlaps(other: Duration): boolean {
            return this.start <= other.end && this.end >= other.start;
        }
    }

    export type CalendarEvent = {
        id: EventID;
        parentEventId?: EventID;
        title: string;
        duration: Duration;
        isRecurring: boolean;
        recurrenceRule?: RecurrenceRule;
    };

    export type RecurrenceRule = {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval: number;
        until?: Date;
        occurrences?: number;
    };

    export type DateRange = {
        start: Date;
        end: Date;
    };
}
