import {jest} from '@jest/globals';
//@ts-ignore
global.Journal = {
    registerSheet: jest.fn(),
    showDialog: async () => {}
};
// Mirror the global onto the v13+ namespaced path used by source code. This must
// happen here (after global.Journal is defined); game.ts loads before this mock.
//@ts-ignore
global.foundry = global.foundry || {};
//@ts-ignore
global.foundry.documents = global.foundry.documents || {};
//@ts-ignore
global.foundry.documents.collections = global.foundry.documents.collections || {};
//@ts-ignore
global.foundry.documents.collections.Journal = global.Journal;
