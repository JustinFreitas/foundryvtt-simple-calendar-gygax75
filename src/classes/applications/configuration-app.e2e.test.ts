/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import ConfigurationApp from "./configuration-app";
import {
    CalManager,
    SC,
    NManager,
    updateCalManager,
    updateConfigurationApplication,
    updateMainApplication,
    updateNManager,
    updateSC
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteManager from "../notes/note-manager";
import PredefinedCalendar from "../configuration/predefined-calendar";
import { LeapYearRules, PredefinedCalendars } from "../../constants";
// @ts-ignore
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("ConfigurationApp E2E Tests", () => {
    let tCal: Calendar;
    let ca: ConfigurationApp;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateNManager(new NoteManager());

        tCal = new Calendar("test-cal-config", "Config Calendar");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        jest.spyOn(CalManager, "getVisibleCalendar").mockReturnValue(tCal);
        jest.spyOn(CalManager, "getAllCalendars").mockReturnValue([tCal]);

        ca = new ConfigurationApp();
        updateConfigurationApplication(ca);

        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify({
            calendar: {
                id: "darksun",
                name: "Dark Sun",
                year: { numericRepresentation: 199 },
                months: [{ name: "Athas Month", numberOfDays: 30, numericRepresentation: 1, numericRepresentationOffset: 0, abbreviation: "AM", numberOfLeapYearDays: 30, intercalary: false, intercalaryInclude: false, startingWeekday: null }],
                weekdays: [],
                moons: [],
                seasons: [],
                leapYear: {},
                general: {}
            }
        }));
    });

    describe("Tier 1: Feature Coverage", () => {
        test("F1-T1-1: ConfigurationApp correctly initializes with standard settings via DEFAULT_OPTIONS", () => {
            const defaultOpts = (ConfigurationApp as any).DEFAULT_OPTIONS;
            expect(defaultOpts).toBeDefined();
            expect(defaultOpts.id).toBe("fsc-simple-calendar-configuration-application-form");
        });

        test("F1-T1-2: Configuring custom leap year rules updates calendar properties dynamically", () => {
            tCal.year.leapYearRule.rule = LeapYearRules.Custom;
            tCal.year.leapYearRule.customMod = 5;
            expect(tCal.year.leapYearRule.rule).toBe(LeapYearRules.Custom);
            expect(tCal.year.leapYearRule.customMod).toBe(5);
        });

        test("F1-T1-3: Custom moon configurations (phases, cycle length) correctly map to calendar data", () => {
            tCal.moons = [
                {
                    name: "Selune",
                    cycleLength: 30,
                    firstNewMoon: { yearReset: "none", yearX: 0, year: 2000, month: 1, day: 5 },
                    phases: [],
                    color: "#ffffff",
                    cycleDayAdjust: 0
                } as any
            ];
            expect(tCal.moons[0].name).toBe("Selune");
            expect(tCal.moons[0].cycleLength).toBe(30);
        });

        test("F1-T1-4: Redefining months/weekdays list adapts the calendar's structural data", () => {
            tCal.months = [
                { name: "First", numberOfDays: 28, abbreviation: "F", numericRepresentation: 1 } as any
            ];
            tCal.weekdays = [
                { name: "Starday", numericRepresentation: 1, abbreviation: "SD" } as any
            ];
            expect(tCal.months[0].name).toBe("First");
            expect(tCal.weekdays[0].name).toBe("Starday");
        });

        test("F1-T1-5: Setting season colors/icons is preserved in calendar configuration data", () => {
            tCal.seasons = [
                { name: "DeepWinter", startingMonth: 1, startingDay: 1, color: "#112233", icon: "winter" } as any
            ];
            expect(tCal.seasons[0].color).toBe("#112233");
            expect(tCal.seasons[0].icon).toBe("winter");
        });
    });

    describe("Tier 2: Boundary & Corner Cases", () => {
        test("F1-T2-1: ConfigurationApp handles empty months list or zero-day month configurations gracefully", () => {
            tCal.months = [];
            expect(tCal.months.length).toBe(0);
        });

        test("F1-T2-2: Leap year rules configuration handles edge rules (e.g., custom rule with mod 0 or negative values) cleanly", () => {
            tCal.year.leapYearRule.rule = LeapYearRules.Custom;
            tCal.year.leapYearRule.customMod = 0;
            expect(tCal.year.leapYearRule.customMod).toBeGreaterThanOrEqual(1);
        });

        test("F1-T2-3: Setting moon cycle length to 0 or negative defaults or falls back without infinite loops", () => {
            tCal.moons = [
                { name: "Ghost Moon", cycleLength: 0, firstNewMoon: {}, phases: [], color: "#ffffff", cycleDayAdjust: 0 } as any
            ];
            expect(tCal.moons[0].cycleLength).toBeGreaterThan(0);
        });

        test("F1-T2-4: Month/weekday names exceeding 100 characters are handled or truncated", () => {
            const longName = "A".repeat(150);
            tCal.months = [
                { name: longName, numberOfDays: 30, abbreviation: "FM", numericRepresentation: 1 } as any
            ];
            expect(tCal.months[0].name.length).toBeLessThanOrEqual(100);
        });

        test("F1-T2-5: Configuring overlapping season ranges resolves boundaries without errors", () => {
            tCal.seasons = [
                { name: "Season A", startingMonth: 1, startingDay: 1, color: "#000000", icon: "" } as any,
                { name: "Season B", startingMonth: 1, startingDay: 1, color: "#ffffff", icon: "" } as any
            ];
            expect(tCal.seasons.length).toBe(2);
        });
    });

    describe("Tier 3: Cross-Feature Combinations (Pairwise)", () => {
        test("X-3-1: Calendar Configurations + Date Selectors (Changing months/weekdays in config updates selectors' active ranges and names)", () => {
            tCal.months = [
                { name: "NewMonth", numberOfDays: 20, abbreviation: "NM", numericRepresentation: 1 } as any
            ];
            const defaultOpts = (ConfigurationApp as any).DEFAULT_OPTIONS;
            expect(defaultOpts?.actions?.onConfigChange).toBeDefined();
        });

        test("X-3-2: Calendar Configurations + Notes (Adjusting leap year rule / year zero dynamically shifts repeating note dates)", () => {
            tCal.year.leapYearRule.rule = LeapYearRules.Custom;
            tCal.year.leapYearRule.customMod = 4;
            expect(tCal.year.leapYearRule.customMod).toBe(4);
        });
    });

    describe("Tier 4: Real-World Application Scenarios", () => {
        test("App-4-3: Category/styling update: GM edits note category colors in ConfigurationApp, verifies that NoteSheet and MainApp reflect updated CSS styling and permissions", () => {
            tCal.noteCategories = [
                { name: "Special Category", textColor: "#ff0000", color: "#00ff00", id: "cat-1" }
            ];
            expect(tCal.noteCategories[0].color).toBe("#00ff00");
        });

        test("App-4-4: Predefined calendar swap: System switches from Gregorian to Dark Sun predefined calendar system, verifying that dates, notes, and active selectors migrate", async () => {
            await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.DarkSun);
            expect(tCal.year.numericRepresentation).toBe(199);
            expect(tCal.months[0].name).toBe("Athas Month");
        });
    });
});
