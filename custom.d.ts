declare module '*.svg' {
    const content: any;
    export default content;
}

type Game = foundry.Game<any, any, any, any, any, any, any, any>;

declare class JournalSheet {
    constructor(...args: any[]);
    static defaultOptions: any;
    get title(): string;
    get isEditable(): boolean;
    close(...args: any[]): any;
    protected _updateObject(...args: any[]): any;
    [key: string]: any;
}
declare var JournalSheet: any;
declare namespace JournalSheet {
    type Options = any;
    type Data = any;
    type FormData = any;
}

declare var Journal: any;
type Journal = any;

declare class FormApplication {
    constructor(...args: any[]);
    static defaultOptions: any;
    close(...args: any[]): any;
    [key: string]: any;
}
declare var FormApplication: any;
declare namespace FormApplication {
    type RenderOptions<T = any> = any;
    type CloseOptions = any;
    type Data<T = any> = any;
}

declare namespace Application {
    type DocumentSheetOptions = any;
    type RenderOptions<T = any> = any;
    type HeaderButton = any;
    type Position = any;
}

declare class Dialog {
    constructor(...args: any[]);
    [key: string]: any;
}
declare var Dialog: any;

type StoredDocument<T> = T;
type DocumentSheetOptions = any;
type FormApplicationOptions = any;
type ConcreteJournalEntry = any;
type JournalDirectory = any;
declare class SceneConfig {
    [key: string]: any;
}
declare var SceneConfig: any;
declare namespace SceneConfig {
    type Data = any;
}
type RoundData = any;
type Canvas = any;
type JQuery<T = any> = any;
declare var $: any;
declare var Hooks: any;
declare var foundry: any;

declare namespace foundry {
    var utils: any;
    namespace documents {
        interface DatabaseUpdateOperation {
            renderSheet?: boolean;
        }
        interface DatabaseDeleteOperation {
            renderSheet?: boolean;
        }
        interface DatabaseCreateOperation {
            renderSheet?: boolean;
        }
    }
}
