import { Types } from './types';

export namespace Errors {
    export class EventOverlapError extends Error {
        constructor() {
            super('Event overlaps with an existing event!');
        }
    }

    export class EventNotFoundError extends Error {
        constructor(id?: Types.EventID, title?: string) {
            if (id) {
                super(`Event with ID ${id} not found!`);
            }

            if (title) {
                super(`Event with title ${title} not found!`);
            }
        }
    }

    export class DateInvalidError extends Error {
        constructor() {
            super(`End date must be after start date!`);
        }
    }
}