/** Determines if the authentication is optional */
export const isAuthOptional = (securityRequirements) => {
    const hasComplexRequirement = securityRequirements.some((requirement) => Object.keys(requirement).length > 1);
    const hasEmptyRequirement = securityRequirements.some((requirement) => Object.keys(requirement).length === 0);
    return hasEmptyRequirement && !hasComplexRequirement;
};
