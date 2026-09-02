import { objectEntries } from '@scalar/helpers/object/object-entries';
import { findVariables } from '@scalar/helpers/regex/find-variables';
import { buildWsQueryParams, mergeWsBindings } from '../channel-example/build-connection-url.js';
import { getResolvedRef } from '../helpers/get-resolved-ref.js';
const getPathParameterNames = (address) => {
    if (address == null || address === '') {
        return [];
    }
    const names = [];
    for (const name of findVariables(address, { includePath: true, includeEnv: false })) {
        if (name && !names.includes(name)) {
            names.push(name);
        }
    }
    return names;
};
const getDefaultParameterValue = (parameter) => {
    if (parameter.default != null) {
        return String(parameter.default);
    }
    if (parameter.examples?.[0] != null) {
        return String(parameter.examples[0]);
    }
    if (parameter.enum?.[0] != null) {
        return String(parameter.enum[0]);
    }
    return '';
};
/**
 * Builds default path and query parameter values from channel definitions and ws bindings.
 */
export const getChannelParameters = (channel, operation, overrides = {}) => {
    const definitions = {};
    if (channel.parameters) {
        for (const [name, parameterRef] of objectEntries(channel.parameters)) {
            definitions[name] = getResolvedRef(parameterRef);
        }
    }
    const path = { ...overrides.path };
    for (const name of getPathParameterNames(channel.address)) {
        if (path[name] == null) {
            const parameter = definitions[name];
            path[name] = parameter ? getDefaultParameterValue(parameter) : '';
        }
    }
    const query = { ...overrides.query };
    const wsBinding = mergeWsBindings(channel, operation);
    const defaultQueryParams = buildWsQueryParams(wsBinding);
    defaultQueryParams.forEach((value, key) => {
        if (query[key] == null) {
            query[key] = value;
        }
    });
    return {
        definitions,
        path,
        query,
    };
};
