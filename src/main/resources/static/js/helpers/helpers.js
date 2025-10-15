export function formatText(str) {
    const isString = (str !== String) ? "" : str;
    return isString.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
