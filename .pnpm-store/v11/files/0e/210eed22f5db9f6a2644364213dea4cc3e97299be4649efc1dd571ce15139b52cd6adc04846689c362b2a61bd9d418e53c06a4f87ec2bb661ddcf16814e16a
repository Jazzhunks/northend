import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { getResolvedRefDeep } from '../../../helpers/get-resolved-ref-deep.js';
import { getExample } from '../../../request-example/builder/helpers/get-example.js';
import { getExampleFromSchema } from '../../../request-example/builder/helpers/get-example-from-schema.js';
/**
 * Basically getExample + we generate an example from the schema if no example is found
 */
export const getExampleFromBody = (requestBody, contentType, exampleName, requestBodyCompositionSelection) => {
    const content = requestBody.content?.[contentType];
    // Return existing example value if we have one
    const example = getExample(requestBody, exampleName, contentType);
    if (example) {
        return example;
    }
    const schema = getResolvedRef(content?.schema);
    if (!schema) {
        return null;
    }
    const resolvedSchema = getResolvedRefDeep(schema);
    // Generate an example from the schema
    const schemaExample = getExampleFromSchema(resolvedSchema, {
        mode: 'write',
        compositionSelection: requestBodyCompositionSelection,
    }, {
        schemaPath: ['requestBody'],
    });
    if (!schemaExample) {
        return null;
    }
    return { value: schemaExample };
};
