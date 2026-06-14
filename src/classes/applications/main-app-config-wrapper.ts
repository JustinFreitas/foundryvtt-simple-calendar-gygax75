import { MainApplication } from "../index";

const ApplicationV2 = foundry.applications.api.ApplicationV2;

/**
 * A thin shim registered as a settings-menu type (game.settings.registerMenu requires the type to be a
 * FormApplication or ApplicationV2 subclass). Its constructor returns the existing MainApplication instance
 * so that clicking the menu button opens the already-built main calendar window instead of a new app.
 */
export default class MainAppConfigWrapper extends ApplicationV2 {
    constructor() {
        super();
        //This is a janky way of having the menu button in a configuration dialog open our existing main application.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return MainApplication;
    }
}
