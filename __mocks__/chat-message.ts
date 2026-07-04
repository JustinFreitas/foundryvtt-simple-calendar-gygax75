import {jest} from '@jest/globals';
// @ts-ignore
global.ChatMessage = <any>{
    create: jest.fn<() => Promise<null>>().mockResolvedValue(null),
    prototype: {
        export: () => {return "[] GM\nMessage"}
    }
};
