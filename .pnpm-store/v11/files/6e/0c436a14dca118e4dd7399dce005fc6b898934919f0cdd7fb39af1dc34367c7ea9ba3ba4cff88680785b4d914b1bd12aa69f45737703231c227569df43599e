import { getResolvedRef } from '../helpers/get-resolved-ref.js';
const getTraitSecurity = (traits) => traits.reduce((security, traitRef) => {
    const trait = getResolvedRef(traitRef);
    return trait.security !== undefined ? trait.security : security;
}, undefined);
/**
 * Merges operation traits into a single operation view, while keeping operation fields highest priority.
 */
export const resolveOperationWithTraits = (operation) => {
    const traits = operation.traits ?? [];
    if (traits.length === 0) {
        return operation;
    }
    const traitSecurity = getTraitSecurity(traits);
    const traitBindings = traits.reduce((accumulated, traitRef) => {
        const trait = getResolvedRef(traitRef);
        if (!trait.bindings) {
            return accumulated;
        }
        const resolvedTraitBindings = getResolvedRef(trait.bindings);
        return accumulated
            ? {
                ...getResolvedRef(accumulated),
                ...resolvedTraitBindings,
            }
            : resolvedTraitBindings;
    }, undefined);
    const hasOperationSecurity = operation.security !== undefined;
    const security = operation.security ?? traitSecurity;
    const bindings = traitBindings && operation.bindings
        ? {
            ...getResolvedRef(traitBindings),
            ...getResolvedRef(operation.bindings),
        }
        : (operation.bindings ?? traitBindings);
    return {
        ...operation,
        ...(security !== undefined || hasOperationSecurity ? { security } : {}),
        ...(bindings !== operation.bindings ? { bindings } : {}),
    };
};
