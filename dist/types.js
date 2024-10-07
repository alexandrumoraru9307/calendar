"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
const errors_1 = require("./errors");
var Types;
(function (Types) {
    class Duration {
        constructor(start, end) {
            this.start = start;
            this.end = end;
            if (end <= start) {
                throw new errors_1.Errors.DateInvalidError();
            }
        }
        overlaps(other) {
            return this.start <= other.end && this.end >= other.start;
        }
    }
    Types.Duration = Duration;
})(Types || (exports.Types = Types = {}));
