export const SYMBOL_PATTERN = /^[A-Z0-9&_.-]{1,20}$/;
export const MAX_ITEMS = 200;

export function normalizeSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^NSE:/, "");
}

export function parseSymbolList(text) {
  const valid = [];
  const invalid = [];
  const seen = new Set();
  String(text || "")
    .split(/[\s,;]+/)
    .map(normalizeSymbol)
    .filter(Boolean)
    .forEach((symbol) => {
      if (seen.has(symbol)) {
        return;
      }
      seen.add(symbol);
      if (SYMBOL_PATTERN.test(symbol)) {
        valid.push(symbol);
      } else {
        invalid.push(symbol);
      }
    });
  return { valid, invalid };
}

export function computeSplit(amount, items, useLeftover) {
  const total = Number(amount) > 0 ? Number(amount) : 0;
  const active = items.filter((item) => item.included && Number(item.price) > 0);
  const target = active.length ? total / active.length : 0;
  const shares = {};
  let spent = 0;

  active.forEach((item) => {
    const qty = Math.floor(target / item.price);
    shares[item.symbol] = qty;
    spent += qty * item.price;
  });

  let leftover = total - spent;
  if (useLeftover) {
    active
      .map((item) => ({ item, gap: target - shares[item.symbol] * item.price }))
      .filter((entry) => entry.gap > 0)
      .sort((a, b) => b.gap - a.gap)
      .forEach(({ item }) => {
        if (item.price <= leftover + 1e-9) {
          shares[item.symbol] += 1;
          leftover -= item.price;
          spent += item.price;
        }
      });
  }

  const rows = items.map((item) => {
    const counted = item.included && Number(item.price) > 0;
    const qty = counted ? shares[item.symbol] : 0;
    const cost = qty * (Number(item.price) || 0);
    const holdQty = Number(item.holdqty) > 0 ? Math.floor(Number(item.holdqty)) : 0;
    const holdAvg = holdQty && Number(item.avgprice) > 0 ? Number(item.avgprice) : 0;
    const invested = holdQty * holdAvg;
    const finalQty = holdQty + qty;
    return {
      ...item,
      counted,
      qty,
      cost,
      diff: counted ? cost - target : 0,
      holdQty,
      holdAvg,
      invested,
      finalQty,
      finalAvg: finalQty ? (invested + cost) / finalQty : 0,
    };
  });

  return {
    target,
    spent,
    leftover,
    activeCount: active.length,
    zeroCount: rows.filter((row) => row.counted && row.qty === 0).length,
    totalShares: rows.reduce((sum, row) => sum + row.qty, 0),
    invested: rows.reduce((sum, row) => sum + row.invested, 0),
    holdCount: rows.filter((row) => row.holdQty > 0).length,
    rows,
  };
}
