/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { foundryGetRoute, foundryMergeObject } from "./utilities";

describe("Foundry Utilities Class Tests", () => {
    test("foundryMergeObject", () => {
        //@ts-ignore
        foundry.utils.mergeObject = jest.fn();
        foundryMergeObject({}, {});
        expect(foundry.utils.mergeObject).toHaveBeenCalledTimes(1);
    });

    test("foundryGetRoute", () => {
        //@ts-ignore
        foundry.utils.getRoute = jest.fn();
        foundryGetRoute("test");
        expect(foundry.utils.getRoute).toHaveBeenCalledTimes(1);
    });
});
