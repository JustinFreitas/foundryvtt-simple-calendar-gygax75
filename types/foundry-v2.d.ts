/**
 * Ambient declarations for the Foundry v13+ ApplicationV2 framework.
 *
 * The installed @league-of-foundry-developers/foundry-vtt-types is pinned at Foundry v9 and has no
 * knowledge of foundry.applications.* (the v2 framework). Rather than bump that package (a large,
 * orthogonal migration), we merge a minimal, permissive declaration into the existing
 * `declare global { namespace foundry {} }` so the v1 -> v2 application ports can reference real
 * symbols instead of @ts-ignore.
 *
 * These signatures are intentionally loose (mostly `any`): the goal is "named, so the ports are
 * checked at the class level" not full v14 type fidelity.
 */

export {};

declare global {
    namespace foundry {
        namespace applications {
            namespace api {
                /**
                 * Base class of the v2 Application framework.
                 */
                class ApplicationV2 {
                    constructor(options?: any);

                    static DEFAULT_OPTIONS: any;

                    options: any;

                    element: HTMLElement;

                    get rendered(): boolean;

                    render(options?: any, _options?: any): Promise<this>;

                    close(options?: any): Promise<this>;

                    _prepareContext(options?: any): Promise<any>;

                    _onRender(context: any, options: any): void | Promise<void>;
                }

                /**
                 * Mixin that adds Handlebars template (PARTS) rendering to an ApplicationV2 subclass.
                 */
                function HandlebarsApplicationMixin<TBase extends abstract new (...args: any[]) => any>(
                    Base: TBase
                ): TBase & {
                    new (...args: any[]): {
                        _prepareContext(options?: any): Promise<any>;
                        _onRender(context: any, options: any): void | Promise<void>;
                    };
                    PARTS: Record<string, { template: string; [key: string]: any }>;
                };

                /**
                 * Base class for v2 document sheets (extends ApplicationV2).
                 */
                class DocumentSheetV2 extends ApplicationV2 {
                    get document(): any;

                    get isEditable(): boolean;

                    submit(options?: any): Promise<any>;
                }

                /**
                 * The v2 dialog helper.
                 */
                class DialogV2 {
                    static confirm(options?: any): Promise<any>;

                    static wait(options?: any): Promise<any>;
                }
            }

            namespace sheets {
                namespace journal {
                    /**
                     * The v2 JournalEntry sheet (extends HandlebarsApplicationMixin(DocumentSheetV2)).
                     */
                    class JournalEntrySheet extends api.DocumentSheetV2 {}
                }
            }

            namespace ux {
                namespace TextEditor {
                    const implementation: {
                        enrichHTML(content: string, options?: any): Promise<string>;
                        [key: string]: any;
                    };
                }

                namespace Draggable {
                    const implementation: new (...args: any[]) => any;
                }

                class FormDataExtended {
                    constructor(form: HTMLFormElement, options?: any);

                    object: any;
                }
            }

            namespace handlebars {
                function renderTemplate(path: string, data: any): Promise<string>;
            }
        }
    }
}
