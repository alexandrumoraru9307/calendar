"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calendar_1 = require("./calendar");
const types_1 = require("./types");
const calendar = new calendar_1.Calendar();
const duration1 = new types_1.Types.Duration(new Date('2017-01-01'), new Date('2022-01-01'));
const duration2 = new types_1.Types.Duration(new Date('2018-01-01'), new Date('2023-01-01'));
calendar.createEvent('event1', duration1);
calendar.createEvent('event2', duration2);
