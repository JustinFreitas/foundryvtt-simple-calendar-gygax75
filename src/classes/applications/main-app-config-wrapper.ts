import { MainApplication } from "../index";

// The v13+ ApplicationV2 framework lives under foundry.applications.api and is not present in the v9 League types.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const ApplicationV2 = foundry.applications.api.ApplicationV2;

/**
 * A thin shim registered as a settings-menu type (game.settings.registerMenu requires the type to be a
 * FormApplication or ApplicationV2 subclass). Its constructor returns the existing MainApplication instance
 * so that clicking the menu button opens the already-built main calendar window instead of a new app.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default class MainAppConfigWrapper extends ApplicationV2 {
    constructor() {
        super();
        //This is a janky way of having the menu button in a configuration dialog open our existing main application.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return MainApplication;
    }
}
