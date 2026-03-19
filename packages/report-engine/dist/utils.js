export function safe(obj, def = '') {
    if (obj === null || obj === undefined)
        return def;
    return obj;
}
export function formatDrugName(name) {
    if (!name)
        return 'Drug';
    if (name === name.toUpperCase() && name.length > 1)
        return name.charAt(0) + name.slice(1).toLowerCase();
    return name;
}
export const MAX_INDICATIONS = 7;
export const MAX_DRUGS_PER_DISEASE = 10;
export const MAX_TARGETS_PER_DISEASE = 10;
export const MAX_DRUGS_PER_TARGET = 5;
export const MAX_DISEASES_PER_TARGET = 8;
export const MAX_TARGETS = 7;
//# sourceMappingURL=utils.js.map