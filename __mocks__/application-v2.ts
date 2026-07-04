import { jest } from "@jest/globals";

/**
 * Minimal mock of foundry.applications.api.ApplicationV2 and HandlebarsApplicationMixin
 * sufficient for unit testing v2 application subclasses (constructor, render, element,
 * static option/parts merging and action wiring).
 */
class ApplicationV2 {
    static DEFAULT_OPTIONS: any = {};
    static STATES = {
        CLOSED: 0,
        CLOSING: 1,
        RENDERING: 2,
        RENDERED: 3
    };

    options: any = {};
    element: any = document.createElement("div");
    state: number = 3;

    get rendered() {
        return this.state === ApplicationV2.STATES.RENDERED;
    }

    constructor(options: any = {}) {
        // Merge the subclass DEFAULT_OPTIONS chain (shallow is enough for tests)
        this.options = { ...(this.constructor as typeof ApplicationV2).DEFAULT_OPTIONS, ...options };
    }

    render(_options?: any) {
        this.state = ApplicationV2.STATES.RENDERED;
        return Promise.resolve(this);
    }

    close() {
        this.state = ApplicationV2.STATES.CLOSED;
        return Promise.resolve();
    }

    setPosition(position: any) {
        return this;
    }

    _prepareContext(_options?: any): any {
        return {};
    }

    _onRender(_context?: any, _options?: any) {}
}

class DocumentSheetV2 extends ApplicationV2 {
    get document() {
        return this.options.document;
    }
    get isEditable() {
        return true;
    }
}

// HandlebarsApplicationMixin just returns a subclass that also carries a static PARTS bag.
// @ts-ignore
function HandlebarsApplicationMixin(Base: any) {
    return class extends Base {
        static PARTS: any = {};
    };
}

class DocumentSheetConfig {
    static registerSheet = jest.fn();
}

class Tabs {
    constructor(config: any = {}) {}
    bind(html: any) {}
    activate(tabName: string, options: any = {}) {}
}

// @ts-ignore
global.foundry = global.foundry || {};
// @ts-ignore
global.foundry.applications = global.foundry.applications || {};
// @ts-ignore
global.foundry.applications.api = global.foundry.applications.api || {};
// @ts-ignore
global.foundry.applications.apps = global.foundry.applications.apps || {};
// @ts-ignore
global.foundry.applications.ux = global.foundry.applications.ux || {};
// @ts-ignore
global.foundry.applications.api.ApplicationV2 = ApplicationV2;
// @ts-ignore
global.foundry.applications.api.DocumentSheetV2 = DocumentSheetV2;
// @ts-ignore
global.foundry.applications.api.HandlebarsApplicationMixin = HandlebarsApplicationMixin;
// @ts-ignore
global.foundry.applications.apps.DocumentSheetConfig = DocumentSheetConfig;
// @ts-ignore
global.foundry.applications.ux.Tabs = Tabs;

export { ApplicationV2, DocumentSheetV2, HandlebarsApplicationMixin, DocumentSheetConfig, Tabs };
