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

// HandlebarsApplicationMixin just returns a subclass that also carries a static PARTS bag.
// @ts-ignore
function HandlebarsApplicationMixin(Base: any) {
    return class extends Base {
        static PARTS: any = {};
    };
}

// @ts-ignore
global.foundry = global.foundry || {};
// @ts-ignore
global.foundry.applications = global.foundry.applications || {};
// @ts-ignore
global.foundry.applications.api = global.foundry.applications.api || {};
// @ts-ignore
global.foundry.applications.api.ApplicationV2 = ApplicationV2;
// @ts-ignore
global.foundry.applications.api.HandlebarsApplicationMixin = HandlebarsApplicationMixin;

export { ApplicationV2, HandlebarsApplicationMixin };
