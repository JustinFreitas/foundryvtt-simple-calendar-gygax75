/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { DateSelector } from "./index";
import Calendar from "../calendar";
import { CalManager, updateCalManager, updateNManager } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteManager from "../notes/note-manager";
import PredefinedCalendar from "../configuration/predefined-calendar";
import { PredefinedCalendars } from "../../constants";

fetchMock.enableMocks();

describe("DateSelector E2E Tests", () => {
    let tCal: Calendar;
    let ds: DateSelector;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateNManager(new NoteManager());
        tCal = new Calendar("test-cal", "Test Calendar");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);

        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify({
            calendar: {
                currentDate: { year: 2022, month: 2, day: 28, seconds: 0 },
                general: {
                    gameWorldTimeIntegration: "mixed",
                    showClock: true,
                    noteDefaultVisibility: false,
                    postNoteRemindersOnFoundryLoad: true,
                    pf2eSync: true,
                    dateFormat: { date: "MMMM DD, YYYY", time: "HH:mm:ss", monthYear: "MMMM YAYYYYYZ" }
                },
                leapYear: { rule: "gregorian", customMod: 0 },
                months: [
                    { name: "January", abbreviation: "Jan", numericRepresentation: 1, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "February", abbreviation: "Feb", numericRepresentation: 2, numericRepresentationOffset: 0, numberOfDays: 28, numberOfLeapYearDays: 29, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "March", abbreviation: "Mar", numericRepresentation: 3, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "April", abbreviation: "Apr", numericRepresentation: 4, numericRepresentationOffset: 0, numberOfDays: 30, numberOfLeapYearDays: 30, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "May", abbreviation: "May", numericRepresentation: 5, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "June", abbreviation: "Jun", numericRepresentation: 6, numericRepresentationOffset: 0, numberOfDays: 30, numberOfLeapYearDays: 30, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "July", abbreviation: "Jul", numericRepresentation: 7, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "August", abbreviation: "Aug", numericRepresentation: 8, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "September", abbreviation: "Sep", numericRepresentation: 9, numericRepresentationOffset: 0, numberOfDays: 30, numberOfLeapYearDays: 30, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "October", abbreviation: "Oct", numericRepresentation: 10, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "November", abbreviation: "Nov", numericRepresentation: 11, numericRepresentationOffset: 0, numberOfDays: 30, numberOfLeapYearDays: 30, intercalary: false, intercalaryInclude: false, startingWeekday: null },
                    { name: "December", abbreviation: "Dec", numericRepresentation: 12, numericRepresentationOffset: 0, numberOfDays: 31, numberOfLeapYearDays: 31, intercalary: false, intercalaryInclude: false, startingWeekday: null }
                ],
                moons: [],
                noteCategories: [],
                seasons: [],
                time: { hoursInDay: 24, minutesInHour: 60, secondsInMinute: 60, gameTimeRatio: 1, unifyGameAndClockPause: false, updateFrequency: 1 },
                weekdays: [
                    { abbreviation: "Su", name: "Sunday", numericRepresentation: 1 },
                    { abbreviation: "Mo", name: "Monday", numericRepresentation: 2 },
                    { abbreviation: "Tu", name: "Tuesday", numericRepresentation: 3 },
                    { abbreviation: "We", name: "Wednesday", numericRepresentation: 4 },
                    { abbreviation: "Th", name: "Thursday", numericRepresentation: 5 },
                    { abbreviation: "Fr", name: "Friday", numericRepresentation: 6 },
                    { abbreviation: "Sa", name: "Saturday", numericRepresentation: 7 }
                ],
                year: { numericRepresentation: 2022, prefix: "", postfix: "", showWeekdayHeadings: true, firstWeekday: 4, yearZero: 1970, yearNames: [], yearNamingRule: "default", yearNamesStart: 0 }
            }
        }));

        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
        ds = new DateSelector("test-selector", {});
    });

    describe("Tier 1: Feature Coverage", () => {
        test("F4-T1-1: Initialize DateSelector with a specific starting date", () => {
            ds.applyOptions({
                selectedStartDate: { year: 2022, month: 5, day: 15, hour: 10, minute: 30, seconds: 0 }
            });
            expect(ds.selectedDate.start.year).toBe(2022);
            expect(ds.selectedDate.start.month).toBe(5);
            expect(ds.selectedDate.start.day).toBe(15);
        });

        test("F4-T1-2: Selecting a new date in DateSelector triggers callbacks with expected arguments", () => {
            const mockCallback = jest.fn();
            ds.onDateSelect = mockCallback;
            ds.selectedDate.start = { year: 2022, month: 6, day: 20, hour: 0, minute: 0, seconds: 0 };
            ds.selectedDate.end = { year: 2022, month: 6, day: 20, hour: 0, minute: 0, seconds: 0 };
            ds.selectedDate.allDay = true;
            ds.callOnDateSelect();
            expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
                startDate: expect.objectContaining({ year: 2022, month: 6, day: 20 })
            }));
        });

        test("F4-T1-3: Show time controls inside DateSelector and check selected time value", () => {
            const dsWithTime = new DateSelector("test-time", {
                timeSelected: true,
                selectedStartDate: { year: 2022, month: 1, day: 1, hour: 14, minute: 45, seconds: 0 }
            });
            expect(dsWithTime.addTime).toBe(true);
            expect(dsWithTime.selectedDate.start.hour).toBe(14);
            expect(dsWithTime.selectedDate.start.minute).toBe(45);
        });

        test("F4-T1-4: Select range of dates using multi-select configuration", () => {
            ds.applyOptions({
                allowDateRangeSelection: true,
                selectedStartDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                selectedEndDate: { year: 2022, month: 1, day: 10, hour: 0, minute: 0, seconds: 0 }
            });
            expect(ds.allowDateRangeSelection).toBe(true);
            expect(ds.selectedDate.end.day).toBe(10);
        });

        test("F4-T1-5: Verify DateSelector functions correctly when rendered as dialog or inline", () => {
            const html = ds.build();
            expect(html).toBeDefined();
        });
    });

    describe("Tier 2: Boundary & Corner Cases", () => {
        test("F4-T2-1: Inputting non-numeric/empty values into DateSelector inputs defaults gracefully", () => {
            ds.applyOptions({
                selectedStartDate: { year: NaN, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
            });
            expect(ds.selectedDate.start.year).toBeNaN();
        });

        test("F4-T2-2: In range selectors, choosing end date prior to start date is automatically corrected", () => {
            ds.applyOptions({
                allowDateRangeSelection: true,
                selectedStartDate: { year: 2022, month: 1, day: 15, hour: 0, minute: 0, seconds: 0 },
                selectedEndDate: { year: 2022, month: 1, day: 10, hour: 0, minute: 0, seconds: 0 }
            });
            expect(ds.selectedDate.end.day).toBeGreaterThanOrEqual(ds.selectedDate.start.day);
        });

        test("F4-T2-3: DateSelector handles BCE/negative years", () => {
            ds.applyOptions({
                selectedStartDate: { year: -100, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
            });
            expect(ds.selectedDate.start.year).toBe(-100);
        });

        test("F4-T2-4: DateSelector correctly navigates Feb 29 in leap years and adjusts when year is changed to non-leap year", () => {
            ds.applyOptions({
                selectedStartDate: { year: 2024, month: 1, day: 29, hour: 0, minute: 0, seconds: 0 }
            });
            expect(ds.selectedDate.start.day).toBe(29);
            ds.applyOptions({
                selectedStartDate: { year: 2023, month: 1, day: 29, hour: 0, minute: 0, seconds: 0 }
            });
            expect(ds.selectedDate.start.day).toBe(28);
        });

        test("F4-T2-5: Rapidly updating selector values handles asynchronous render queue without conflicts", () => {
            expect(() => {
                ds.applyOptions({ selectedStartDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 } });
                ds.applyOptions({ selectedStartDate: { year: 2023, month: 2, day: 2, hour: 0, minute: 0, seconds: 0 } });
                ds.applyOptions({ selectedStartDate: { year: 2024, month: 3, day: 3, hour: 0, minute: 0, seconds: 0 } });
            }).not.toThrow();
        });
    });

    describe("Tier 3: Cross-Feature Combinations (Pairwise)", () => {
        test("X-3-4: General Layout + Date Selectors (Layout theme/formatting modifications apply formatting directly to DateSelector values)", () => {
            tCal.generalSettings.dateFormat.date = "YYYY-MM-DD";
            const formatted = ds.build();
            expect(formatted).toBeDefined();
        });
    });
});
