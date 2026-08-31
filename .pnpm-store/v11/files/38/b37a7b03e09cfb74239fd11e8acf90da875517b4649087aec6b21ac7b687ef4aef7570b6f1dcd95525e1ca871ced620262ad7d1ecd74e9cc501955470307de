import { objectKeys } from '@scalar/helpers/object/object-keys';
import { getResolvedRef } from '../../../helpers/get-resolved-ref.js';
/**
 * Get the selected security schemes from security requirements.
 * Takes security requirement objects and resolves them to actual security scheme objects.
 */
export const getSecuritySchemes = (securitySchemes, selectedSecurity) => objectKeys(selectedSecurity).flatMap((key) => {
    const scheme = getResolvedRef(securitySchemes?.[key]);
    if (scheme) {
        return scheme;
    }
    return [];
});
