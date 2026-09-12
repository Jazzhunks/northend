import { parse, stringify } from 'yaml';
/** Yaml handling with optional safeparse */
export const yaml = {
    /** Parse and throw if the return value is not an object */
    parse: (val) => {
        const yamlObject = parse(val, { merge: true, maxAliasCount: 10000 });
        if (typeof yamlObject !== 'object') {
            throw Error('Invalid YAML object');
        }
        return yamlObject;
    },
    /** Parse and return a fallback on failure */
    parseSafe(val, fallback) {
        try {
            return yaml.parse(val);
        }
        catch (err) {
            return typeof fallback === 'function' ? fallback(err) : fallback;
        }
    },
    stringify,
};
/** JSON handling with optional safeparse */
export const json = {
    /** Parse and throw if the return value is not an object */
    parse: (val) => {
        const jsonObject = JSON.parse(val);
        if (typeof jsonObject !== 'object') {
            throw Error('Invalid JSON object');
        }
        return jsonObject;
    },
    /** Parse and return a fallback on failure */
    parseSafe(val, fallback) {
        try {
            return json.parse(val);
        }
        catch (err) {
            return typeof fallback === 'function' ? fallback(err) : fallback;
        }
    },
    stringify: (val) => JSON.stringify(val),
};
/**
 * This helper is used to transform the content of the swagger file to JSON, even it was YAML.
 */
export const transformToJson = (value) => {
    // Try json, then fallback to yaml, then fallback to string
    return JSON.stringify(json.parseSafe(value, yaml.parseSafe(value, value)));
};
/** Validates a JSON string if provided. Otherwise returns the raw YAML */
export function formatJsonOrYamlString(value) {
    // If we don't start with a bracket assume yaml
    const trimmed = value.trim();
    if (trimmed[0] !== '{' && trimmed[0] !== '[') {
        return value;
    }
    try {
        // JSON
        return JSON.stringify(JSON.parse(value), null, 2);
    }
    catch {
        // YAML
        return value;
    }
}
/** Parse JSON or YAML into an object */
export const parseJsonOrYaml = (value) => {
    if (typeof value !== 'string') {
        return value;
    }
    const jsonObject = json.parseSafe(value, null);
    if (jsonObject) {
        return jsonObject;
    }
    // Value is probably supposed to be JSON. Throw
    if (value.length > 0 && ['{', '['].includes(value[0] ?? '')) {
        throw Error('Invalid JSON or YAML');
    }
    return yaml.parseSafe(value, (err) => {
        throw Error(err);
    });
};
