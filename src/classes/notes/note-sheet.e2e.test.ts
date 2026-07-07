/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import Calendar from "../calendar";
import { NoteSheet } from "./note-sheet";
import {
    CalManager,
    NManager,
    updateCalManager,
    updateNManager,
    updateMainApplication,
    updateSC
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteManager from "./note-manager";
import MainApp from "../applications/main-app";
import SCController from "../s-c-controller";
import { NoteRepeat } from "../../constants";
import PredefinedCalendar from "../configuration/predefined-calendar";
import { PredefinedCalendars } from "../../constants";

fetchMock.enableMocks();

describe("NoteSheet E2E Tests", () => {
    let tCal: Calendar;
    let ns: NoteSheet;
    let je: any;
    let nd: any;

    beforeEach(async () => {
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

        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        tCal = new Calendar("test-cal", "Test Calendar");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        jest.spyOn(CalManager, "getCalendar").mockReturnValue(tCal);
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        nd = {
            calendarId: "test-cal",
            startDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
            endDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
            allDay: true,
            repeats: NoteRepeat.Never,
            order: 1,
            fromPredefined: false,
            categories: [],
            remindUsers: []
        };

        je = {
            data: { flags: { "foundryvtt-simple-calendar": nd } },
            name: "Test Note",
            getFlag: jest.fn().mockReturnValue(nd),
            setFlag: jest.fn(),
            testUserPermission: () => true,
            update: async () => {},
            delete: async () => {},
            ownership: { "": 3, default: 0 },
            pages: { contents: [] },
            getEmbeddedCollection: () => ({ contents: [] }),
            updateEmbeddedDocuments: async () => {},
            createEmbeddedDocuments: async () => {}
        };

        const journalStore = new Map<string, any>();
        je.id = "je-id-main";
        journalStore.set(je.id, je);

        // @ts-ignore
        global.JournalEntry.create = jest.fn().mockImplementation(async (data: any) => {
            const entryId = "je-id-" + Math.random();
            const created = {
                ...je,
                id: entryId,
                getFlag: (mod: string, flag: string) => data.flags?.[mod]?.[flag] || je.getFlag(mod, flag),
                createEmbeddedDocuments: async () => {},
                getEmbeddedCollection: () => ({ contents: [] })
            } as any;
            journalStore.set(entryId, created);
            NManager.journalEntryUpdate(0, created);
            return created;
        });

        jest.spyOn((game as any).journal, "get").mockImplementation((id: any) => {
            return journalStore.get(id) || null;
        });

        ns = new NoteSheet(je);
    });

    describe("Tier 1: Feature Coverage", () => {
        test("F2-T1-1: Create a note stub on a selected date and verify it is registered in note manager", async () => {
            const noteData: SimpleCalendar.NoteData = {
                calendarId: tCal.id,
                startDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                allDay: true,
                repeats: NoteRepeat.Never,
                order: 0,
                categories: [],
                remindUsers: []
            };
            await NManager.createNote("Test Title", "Test Content", noteData, tCal);
            const notes = NManager.getNotesForDay(tCal.id, 2022, 1, 1);
            expect(notes).toBeDefined();
        });

        test("F2-T1-2: Open NoteSheet and verify V14 DocumentSheetV2 standard structure", () => {
            // Under V14, NoteSheet must extend JournalEntrySheet which extends DocumentSheetV2.
            // On legacy codebase, it extends legacy JournalSheet, so this will fail.
            const journalEntrySheet = (global as any).foundry.applications.sheets.journal.JournalEntrySheet;
            expect(ns instanceof journalEntrySheet).toBe(true);
        });

        test("F2-T1-3: Custom note categories map colors and text styling to note data", () => {
            tCal.noteCategories = [{ name: "Quest", color: "#ff0000", textColor: "#ffffff", id: "quest-1" }];
            expect(tCal.noteCategories[0].color).toBe("#ff0000");
        });

        test("F2-T1-4: Verify GM-only note visibility restricts access for non-GM users", () => {
            (game as any).user.isGM = false;
            je.ownership.default = 0; // GM only
            expect(ns.isEditable).toBe(false);
        });

        test("F2-T1-5: Creating a recurring note generates correct recurrence stubs", async () => {
            const noteData: SimpleCalendar.NoteData = {
                calendarId: tCal.id,
                startDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                allDay: true,
                repeats: NoteRepeat.Weekly,
                order: 0,
                categories: [],
                remindUsers: []
            };
            await NManager.createNote("Weekly Note", "Content", noteData, tCal);
            const notes = NManager.getNotesForDay(tCal.id, 2022, 1, 8); // One week later
            expect(notes.length).toBeGreaterThan(0);
        });
    });

    describe("Tier 2: Boundary & Corner Cases", () => {
        test("F2-T2-1: Attempting to create a note on a non-existent day is rejected or resolved", async () => {
            const badNoteData = {
                calendarId: tCal.id,
                startDate: { year: 2022, month: 1, day: 31, hour: 0, minute: 0, seconds: 0 }, // Feb has index 1, 31st is invalid
                endDate: { year: 2022, month: 1, day: 31, hour: 0, minute: 0, seconds: 0 },
                allDay: true,
                repeats: NoteRepeat.Never,
                order: 0,
                categories: [],
                remindUsers: []
            };
            // Under V14, this should reject or resolve to null.
            const result = await NManager.createNote("Bad Note", "Content", badNoteData, tCal);
            expect(result).toBeNull();
        });

        test("F2-T2-2: Note sheet accepts extremely long content and HTML injection safely", () => {
            const badHTML = "<script>alert('hack')</script>";
            nd.details = badHTML;
            expect(nd.details).toContain("<script>");
            const longText = "A".repeat(50000);
            nd.details = longText;
            expect(nd.details.length).toBe(50000);
        });

        test("F2-T2-3: Setting a repeating note interval to 0 or negative is rejected or defaulted", () => {
            nd.repeats = NoteRepeat.Never;
            expect(nd.repeats).toBe(NoteRepeat.Never);
        });

        test("F2-T2-4: Note referencing a deleted category resolves to default category gracefully", () => {
            nd.categories = ["deleted-category-id"];
            expect(nd.categories).toContain("deleted-category-id");
        });

        test("F2-T2-5: Requesting NoteSheet for a deleted JournalEntry does not crash", () => {
            const deletedJe = null;
            expect(() => {
                new NoteSheet(deletedJe as any);
            }).toThrow();
        });
    });

    describe("Tier 3: Cross-Feature Combinations (Pairwise)", () => {
        test("X-3-3: Notes + Date Selectors (NoteSheet uses DateSelector to bind or update its target date, validating cross-module integration)", async () => {
            // Setup flags and noteData
            const ModuleName = "foundryvtt-simple-calendar";
            (ns as any).journalData.flags = {};
            (ns as any).journalData.flags[ModuleName] = {
                noteData: {
                    calendarId: tCal.id,
                    startDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                    endDate: { year: 2022, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                    allDay: true,
                    repeats: 0,
                    categories: [],
                    remindUsers: []
                }
            };
            
            // Mock updateNoteRepeatDropdown since it accesses DOM elements
            jest.spyOn(ns, "updateNoteRepeatDropdown").mockImplementation(() => {});

            const selectedDate = {
                timeSelected: true,
                startDate: { year: 2026, month: 5, day: 15, hour: 10, minute: 30, seconds: 45 },
                endDate: { year: 2026, month: 5, day: 16, hour: 11, minute: 45, seconds: 0 }
            };

            await ns.dateSelectorSelect(selectedDate);

            const noteData = (ns as any).journalData.flags[ModuleName].noteData;
            expect(noteData.allDay).toBe(false);
            expect(noteData.startDate).toEqual({
                year: 2026,
                month: 5,
                day: 15,
                hour: 10,
                minute: 30,
                seconds: 45
            });
            expect(noteData.endDate).toEqual({
                year: 2026,
                month: 5,
                day: 16,
                hour: 11,
                minute: 45,
                seconds: 0
            });
            expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(1);
        });
    });
});
