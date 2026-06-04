// EU keyboards type "," as the decimal separator. Normalise it to a dot at the
// input layer so everything downstream (Number(), parseFloat()) just works.
export const normalizeDecimal = (s) => String(s).replace(',', '.');
