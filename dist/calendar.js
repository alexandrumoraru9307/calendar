"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const types_1 = require("./types");
const errors_1 = require("./errors");
class Calendar {
    constructor() {
        this.events = [];
    }
    createEvent(title, duration, allowOverlap = false, recurrenceRule) {
        if (!allowOverlap && this.hasOverlap(duration)) {
            throw new errors_1.Errors.EventOverlapError();
        }
        const newEvent = {
            id: this.generateId(),
            title,
            duration,
            isRecurring: !!recurrenceRule,
            recurrenceRule,
        };
        this.events.push(newEvent);
        return newEvent;
    }
    listEvents(range) {
        return this.events.filter(event => event.duration.overlaps(new types_1.Types.Duration(range.start, range.end)));
    }
    updateEvent(id, newTitle, newDuration, allowOverlap = false) {
        const event = this.findEvent(id);
        if (!allowOverlap && this.hasOverlap(newDuration, id)) {
            throw new errors_1.Errors.EventOverlapError();
        }
        event.title = newTitle;
        event.duration = newDuration;
        return event;
    }
    deleteEvent(id) {
        const index = this.events.findIndex(event => event.id === id);
        if (index === -1) {
            throw new errors_1.Errors.EventNotFoundError(id);
        }
        this.events.splice(index, 1);
    }
    hasOverlap(newDuration, excludeId) {
        return this.events.some(event => event.duration.overlaps(newDuration) && event.id !== excludeId);
    }
    findEvent(id) {
        const event = this.events.filter(event => event.id === id)[0];
        if (!event) {
            throw new errors_1.Errors.EventNotFoundError(id);
        }
        return event;
    }
    findEventByTitle(title) {
        const event = this.events.filter(event => event.title === title)[0];
        if (!event) {
            throw new errors_1.Errors.EventNotFoundError(undefined, title);
        }
        return event;
    }
    generateId() {
        return (Math.random() * 1000000).toString(16);
    }
}
exports.Calendar = Calendar;
