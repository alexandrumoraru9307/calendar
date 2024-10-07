"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
var Errors;
(function (Errors) {
    class EventOverlapError extends Error {
        constructor() {
            super('dasdasdasdasdasdasdasdasd');
        }
    }
    Errors.EventOverlapError = EventOverlapError;
    class EventNotFoundError extends Error {
        constructor(id, title) {
            if (id) {
                super(`Event with ID ${id} not found!`);
            }
            if (title) {
                super(`Event with title ${title} not found!`);
            }
        }
    }
    Errors.EventNotFoundError = EventNotFoundError;
    class DateInvalidError extends Error {
        constructor() {
            super(`End date must be after start date!`);
        }
    }
    Errors.DateInvalidError = DateInvalidError;
})(Errors || (exports.Errors = Errors = {}));
