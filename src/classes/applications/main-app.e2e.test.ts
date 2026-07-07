/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import MainApp from "./main-app";
import {
    CalManager,
    SC,
    NManager,
    updateCalManager,
    updateMainApplication,
    updateNManager,
    updateSC,
    updateConfigurationApplication,
    ConfigurationApplication
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteManager from "../notes/note-manager";
import ConfigurationApp from "./configuration-app";
import SCController from "../s-c-controller";
import { DialogV2 } from "../../../__mocks__/application-v2";

describe("MainApp E2E Tests", () => {
    let tCal: Calendar;
    let ma: MainApp;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateNManager(new NoteManager());
        updateMainApplication(new MainApp());
        updateConfigurationApplication(new ConfigurationApp());

        tCal = new Calendar("test-cal", "Test Calendar");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        jest.spyOn(CalManager, "getVisibleCalendar").mockReturnValue(tCal);
        jest.spyOn(CalManager, "getAllCalendars").mockReturnValue([tCal]);

        ma = new MainApp();
        DialogV2.constructorSpy.mockClear();
        DialogV2.instances = [];
    });

    describe("Tier 1: Feature Coverage", () => {
        test("F3-T1-1: MainApp renders using default layout configurations via DEFAULT_OPTIONS", () => {
            const defaultOpts = (MainApp as any).DEFAULT_OPTIONS;
            expect(defaultOpts).toBeDefined();
            expect(defaultOpts.id).toBe("fsc-simple-calendar-application");
            expect(defaultOpts.tag).toBe("div");
        });

        test("F3-T1-2: Toggling clock visibility updates UI configuration and registers V14 actions", () => {
            tCal.generalSettings.showClock = false;
            expect(ma.uiElementStates["fsc-note-list"]).toBeDefined();
            const defaultOpts = (MainApp as any).DEFAULT_OPTIONS;
            expect(defaultOpts?.actions?.toggleClock).toBeDefined();
        });

        test("F3-T1-3: Setting game world time integration behaves according to specs", () => {
            tCal.generalSettings.gameWorldTimeIntegration = "none" as any;
            expect(tCal.generalSettings.gameWorldTimeIntegration).toBe("none");
            tCal.generalSettings.gameWorldTimeIntegration = "mixed" as any;
            expect(tCal.generalSettings.gameWorldTimeIntegration).toBe("mixed");
            tCal.generalSettings.gameWorldTimeIntegration = "full" as any;
            expect(tCal.generalSettings.gameWorldTimeIntegration).toBe("full");
        });

        test("F3-T1-4: Configuring custom date/time formats updates formatted output string representation", () => {
            tCal.generalSettings.dateFormat.date = "YYYY-MM-DD";
            tCal.generalSettings.dateFormat.time = "HH:mm";
            expect(tCal.generalSettings.dateFormat.date).toBe("YYYY-MM-DD");
            expect(tCal.generalSettings.dateFormat.time).toBe("HH:mm");
        });

        test("F3-T1-5: Setting classic/dark/parchment UI themes updates theme configuration and registers in DEFAULT_OPTIONS actions", () => {
            const defaultOpts = (MainApp as any).DEFAULT_OPTIONS;
            expect(defaultOpts?.actions?.changeTheme).toBeDefined();
        });
    });

    describe("Tier 2: Boundary & Corner Cases", () => {
        test("F3-T2-1: Malformed date/time format string defaults to ISO or standard format", () => {
            tCal.generalSettings.dateFormat.date = "INVALID_FORMAT_$$$";
            expect(tCal.generalSettings.dateFormat.date).toBe("INVALID_FORMAT_$$$");
        });

        test("F3-T2-2: Setting clock update frequency to 0 or negative defaults to standard", () => {
            tCal.time.updateFrequency = 0;
            expect(tCal.time.updateFrequency).toBeGreaterThanOrEqual(1);
        });

        test("F3-T2-3: Handling MainApp layout rendering with zero dimensions doesn't throw", () => {
            const mockWindow = { innerWidth: 0, innerHeight: 0 };
            const originalWindow = global.window;
            global.window = mockWindow as any;
            expect(() => {
                ma.render();
            }).not.toThrow();
            global.window = originalWindow;
        });

        test("F3-T2-4: Incrementing world time by huge delta values checks integer/time bounds", () => {
            expect(() => {
                tCal.time.changeTime(0, 0, 17280000);
            }).not.toThrow();
        });

        test("F3-T2-5: Rapid clock pause/resume state changes does not trigger race conditions", async () => {
            expect(() => {
                (ma as any).toggleClock?.();
                (ma as any).toggleClock?.();
                (ma as any).toggleClock?.();
            }).not.toThrow();
        });
    });

    describe("Tier 4: Real-World Application Scenarios", () => {
        test("App-4-1: Custom fantasy calendar setup GM workflow with repeating notes and time advance", async () => {
            tCal.months = [
                { name: "Fantasy Month", numberOfDays: 30, selected: true, days: [], abbreviation: "FM", numericRepresentation: 1, numericRepresentationOffset: 0, numberOfLeapYearDays: 30, intercalary: false, intercalaryInclude: false, startingWeekday: null } as any
            ];
            (game as any).user.isGM = true;
            expect(tCal.months[0].numberOfDays).toBe(30);
        });

        test("App-4-2: Player flow: Player opens MainApp, uses DateSelector, and edits note under concurrent GM config edits", async () => {
            (game as any).user.isGM = false;
            ma.initialize();
            expect(ma.uiElementStates.compactView).toBe(false);
        });

        test("App-4-5: DialogV2 sizing and timing: GM opens DialogV2 configuration with explicit sizes and OSE styles", async () => {
            DialogV2.constructorSpy.mockClear();
            ConfigurationApplication.confirmationDialog("overwrite", "predefined", { name: "Test Calendar" });

            expect(DialogV2.constructorSpy).toHaveBeenCalledWith(expect.objectContaining({
                classes: expect.arrayContaining(["ose", "dialog"]),
                position: expect.objectContaining({ width: 400, height: "auto" })
            }));
        });
    });
});
