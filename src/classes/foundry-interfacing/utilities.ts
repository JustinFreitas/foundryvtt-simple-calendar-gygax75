export function foundryMergeObject(
    original: {},
    other?: any,
    options?: {
        insertKeys: boolean;
        insertValues: boolean;
        overwrite: boolean;
        recursive: boolean;
        inplace: boolean;
        enforceTypes: boolean;
        performDeletions: boolean;
    },
    _d?: number
) {
    return foundry.utils.mergeObject(original, other, options, _d);
}

export function foundryGetRoute(path: string, { prefix }: { prefix?: string | null } = {}) {
    return foundry.utils.getRoute(path, { prefix });
}
