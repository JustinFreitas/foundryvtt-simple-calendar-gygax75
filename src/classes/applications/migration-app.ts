import { GameSettings } from "../foundry-interfacing/game-settings";
import { MigrationTypes, NoteReminderNotificationType, SettingNames, Themes } from "../../constants";
import { Logger } from "../logging";
import V1ToV2 from "../migrations/v1-to-v2";
import { CalManager, MainApplication, SC } from "../index";
import { isObjectEmpty } from "../utilities/object";
import { GetThemeName } from "../utilities/visual";

const ApplicationV2 = foundry.applications.api.ApplicationV2;
const HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

export default class MigrationApp extends HandlebarsApplicationMixin(ApplicationV2) {
    /**
     * The ID used for the application window within foundry
     * @type {string}
     */
    public static appWindowId: string = "fsc-migration-application";

    /**
     * The default application options (ApplicationV2)
     */
    static DEFAULT_OPTIONS = {
        id: MigrationApp.appWindowId,
        classes: ["simple-calendar"],
        window: {
            title: "FSC.Migration.Title",
            resizable: false
        },
        position: {
            width: 500
        },
        actions: {
            clean: MigrationApp.onCleanAction
        }
    };

    /**
     * The Handlebars template parts (ApplicationV2 + HandlebarsApplicationMixin)
     */
    static PARTS = {
        body: {
            template: "modules/foundryvtt-simple-calendar/templates/migration.html"
        }
    };

    public MigrationType: MigrationTypes = MigrationTypes.none;

    private displayData = {
        calendarMigrationStatusIcon: "fa-sync fa-spin fsc-running",
        globalConfigMigrationStatusIcon: "fa-sync fa-spin fsc-running",
        notesMigrationStatusIcon: "fa-sync fa-spin fsc-running",
        enableCleanUp: false,
        migrationDone: false
    };

    /**
     * Shows the application window
     */
    public showApp() {
        this.render({ force: true });
    }

    /**
     * Prepares the rendering context for the template (ApplicationV2 replacement for getData)
     */
    async _prepareContext(): Promise<object> {
        return {
            display: this.displayData,
            headingTitle: this.headingTitle,
            description: this.description
        };
    }

    /**
     * Applies the current theme class after each render (ApplicationV2 replacement for per-render classes)
     */
    _onRender(context: object, options: object) {
        super._onRender(context, options);
        this.element?.classList.add(GetThemeName());
    }

    /**
     * ApplicationV2 action handler for the "clean" button (data-action="clean").
     * Bound to the application instance by the framework.
     */
    static onCleanAction(this: MigrationApp) {
        this.runCleanData();
    }

    get headingTitle() {
        let t = "";
        switch (this.MigrationType) {
            case MigrationTypes.v1To2:
                t = "FSC.Migration.v1v2.Title";
                break;
            default:
                t = "Migration";
                break;
        }
        return t;
    }

    get description() {
        let t = "";
        switch (this.MigrationType) {
            case MigrationTypes.v1To2:
                t = "FSC.Migration.v1v2.Help";
                break;
            default:
                t = "This dialog has not loaded property. Try refreshing the page.";
                break;
        }
        return t;
    }

    public initialize() {
        if (GameSettings.IsGm()) {
            this.determineMigrationType();
        }
    }

    private determineMigrationType() {
        const genConfig = <SimpleCalendar.GlobalConfigurationData>GameSettings.GetObjectSettings(SettingNames.GlobalConfiguration);
        const oldYearConfig = GameSettings.GetObjectSettings(SettingNames.YearConfiguration);
        //Check to see if the old year config is empty, if it is then this is a new installation
        //Check to see if we need to update from v1 to 2
        //If there is no version property on the general configuration object then we are still on version 1
        if (isObjectEmpty(oldYearConfig) && isObjectEmpty(genConfig)) {
            this.MigrationType = MigrationTypes.none;
        } else if (!isObjectEmpty(oldYearConfig) && !Object.prototype.hasOwnProperty.call(genConfig, "version")) {
            Logger.info("Migration required from Simple Calendar v1 to Version 2");
            this.MigrationType = MigrationTypes.v1To2;
        }
    }

    public get showMigration() {
        return this.MigrationType !== MigrationTypes.none;
    }

    public async run(force: boolean = false) {
        if (force) {
            this.MigrationType = MigrationTypes.v1To2;
        }
        Logger.info(`Running Migration!`);
        this.showApp();
        const cm = this.runCalendarMigration();
        this.showApp();
        const nm = await this.runNoteMigration();
        this.showApp();
        if (cm && nm) {
            this.displayData.enableCleanUp = true;
            this.displayData.migrationDone = true;
            MainApplication.render();
            this.showApp();
        }
    }

    public runCalendarMigration() {
        Logger.info("Migrating Calendar Configuration...");
        if (this.MigrationType === MigrationTypes.v1To2) {
            let calSuccess = false,
                globConfigSuccess = false;
            const newCalendar = V1ToV2.runCalendarMigration();
            if (newCalendar !== null) {
                CalManager.setCalendars([newCalendar]);
                this.displayData.calendarMigrationStatusIcon = "fa-check-circle fsc-completed";
                Logger.info("Calendar Configuration successfully migrated!");
                Logger.info("Migrating Permissions and General Settings...");
                calSuccess = true;
            } else {
                Logger.error("There was an error converting the existing calendar configuration to the new calendar data model.");
                this.displayData.calendarMigrationStatusIcon = "fa-times-circle fsc-error";
                this.displayData.globalConfigMigrationStatusIcon = "fa-ban fsc-cancel";
            }
            if (V1ToV2.runGlobalConfigurationMigration()) {
                Logger.info("Permissions and General Settings successfully migrated!");
                this.displayData.globalConfigMigrationStatusIcon = "fa-check-circle fsc-completed";
                this.saveMigratedData();
                globConfigSuccess = true;
            } else {
                Logger.error(
                    "There was an error converting the existing permissions and general settings to the new permissions and general settings data model."
                );
                this.displayData.globalConfigMigrationStatusIcon = "fa-times-circle fsc-error";
            }
            return calSuccess && globConfigSuccess;
        }
        return false;
    }

    public saveMigratedData() {
        SC.save(SC.globalConfiguration, {
            id: "",
            theme: Themes[0].key,
            openOnLoad: true,
            openCompact: false,
            rememberPosition: true,
            rememberCompactPosition: false,
            appPosition: {},
            noteReminderNotification: NoteReminderNotificationType.whisper,
            sideDrawerDirection: "sc-right",
            alwaysShowNoteList: false,
            persistentOpen: false,
            compactViewScale: 100
        });
    }

    public async runNoteMigration() {
        Logger.info("Migrating Calendar Notes...");

        if (this.MigrationType === MigrationTypes.v1To2) {
            if (await V1ToV2.runNoteMigration()) {
                Logger.info("Calendar Notes successfully migrated!");
                this.displayData.notesMigrationStatusIcon = "fa-check-circle fsc-completed";
                return true;
            } else {
                Logger.error("There was an error converting the existing notes to journal entries.");
                this.displayData.notesMigrationStatusIcon = "fa-times-circle fsc-error";
            }
        }
        return false;
    }

    public runCleanData() {
        Logger.info("Clearing all old data...");
        if (this.MigrationType === MigrationTypes.v1To2) {
            V1ToV2.cleanUpOldData()
                .then(() => {
                    GameSettings.UiNotification(GameSettings.Localize("FSC.Migration.v1v2.CleanupSuccess"), "info");
                })
                .catch((e: Error) => {
                    console.log(e);
                    GameSettings.UiNotification(GameSettings.Localize("FSC.Migration.v1v2.CleanupFail"), "warning");
                });
            Logger.info("All old data has been cleared.");
        }
    }
}
