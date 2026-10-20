const SYMBOL_PATTERN = /^[A-Z0-9&_.-]{1,20}$/;
const DEFAULT_SPLITPLAN_MAX_ITEMS = 32;

function normalizeSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^(NSE|BSE):/, "")
    .replace(/\.(NS|BO)$/, "")
    .replace(/-(EQ|BE|BZ|SM|ST)$/, "");
}

function positiveOrZero(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function splitPlanMaxItems() {
  const n = Number(global.appConfig && global.appConfig.splitPlanMaxItems);
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_SPLITPLAN_MAX_ITEMS;
}

module.exports = { SYMBOL_PATTERN, normalizeSymbol, positiveOrZero, splitPlanMaxItems };
