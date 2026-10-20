export const SYMBOL_PATTERN = /^[A-Z0-9&_.-]{1,20}$/;

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

export function newPlanItem(fields) {
  return {
    symbol: "",
    price: 0,
    lasttradedprice: 0,
    holdqty: 0,
    avgprice: 0,
    included: true,
    error: "",
    loading: false,
    ...fields,
  };
}

export function toEditable(saved) {
  return {
    _id: saved._id,
    name: saved.name,
    amount: saved.amount,
    useleftover: saved.useleftover !== false,
    allocationmode: saved.allocationmode || "equal",
    items: (saved.items || []).map((item) =>
      newPlanItem({
        symbol: item.symbol,
        price: item.price || 0,
        lasttradedprice: item.lasttradedprice || 0,
        holdqty: item.holdqty || 0,
        avgprice: item.avgprice || 0,
        included: item.included !== false,
      })
    ),
  };
}

export const ALLOCATION_MODES = [
  { id: "equal", name: "Equal split" },
  { id: "profit_desc", name: "Profit: high to low" },
  { id: "profit_asc", name: "Profit: low to high" },
];

const EPSILON = 1e-9;

function holding(item) {
  const holdQty = Number(item.holdqty) > 0 ? Math.floor(Number(item.holdqty)) : 0;
  const holdAvg = holdQty && Number(item.avgprice) > 0 ? Number(item.avgprice) : 0;
  const price = Number(item.price) || 0;
  const held = holdAvg > 0 && price > 0;
  return {
    holdQty,
    holdAvg,
    pnl: held ? (price - holdAvg) * holdQty : 0,
    pnlPercent: held ? ((price - holdAvg) / holdAvg) * 100 : 0,
  };
}

function rankWeights(active, mode) {
  const weights = {};
  if (mode !== "profit_desc" && mode !== "profit_asc") {
    active.forEach((item) => {
      weights[item.symbol] = 1;
    });
    return weights;
  }
  const n = active.length;
  const sign = mode === "profit_desc" ? -1 : 1;
  const sorted = active
    .map((item) => ({ symbol: item.symbol, pnl: holding(item).pnlPercent }))
    .sort((a, b) => sign * (a.pnl - b.pnl));
  let start = 0;
  while (start < n) {
    let end = start;
    while (end + 1 < n && Math.abs(sorted[end + 1].pnl - sorted[start].pnl) < EPSILON) {
      end += 1;
    }
    const avgRank = (start + end) / 2 + 1;
    for (let k = start; k <= end; k += 1) {
      weights[sorted[k].symbol] = n - avgRank + 1;
    }
    start = end + 1;
  }
  return weights;
}

export function computeSplit(amount, items, useLeftover, mode = "equal") {
  const total = Number(amount) > 0 ? Number(amount) : 0;
  const active = items.filter((item) => item.included && Number(item.price) > 0);
  const weights = rankWeights(active, mode);
  const weightSum = active.reduce((sum, item) => sum + weights[item.symbol], 0);
  const targets = {};
  const shares = {};
  let spent = 0;

  active.forEach((item) => {
    const target = (total * weights[item.symbol]) / weightSum;
    const qty = Math.floor(target / item.price);
    targets[item.symbol] = target;
    shares[item.symbol] = qty;
    spent += qty * item.price;
  });

  let leftover = total - spent;
  if (useLeftover) {
    active
      .map((item) => ({
        item,
        weight: weights[item.symbol],
        gap: targets[item.symbol] - shares[item.symbol] * item.price,
      }))
      .filter((entry) => entry.gap > 0)
      .sort((a, b) => b.weight - a.weight || b.gap - a.gap)
      .forEach(({ item }) => {
        if (item.price <= leftover + EPSILON) {
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
    const target = counted ? targets[item.symbol] : 0;
    const { holdQty, holdAvg, pnl, pnlPercent } = holding(item);
    const invested = holdQty * holdAvg;
    const finalQty = holdQty + qty;
    return {
      ...item,
      counted,
      qty,
      cost,
      target,
      diff: counted ? cost - target : 0,
      holdQty,
      holdAvg,
      pnl,
      pnlPercent,
      invested,
      finalQty,
      finalAvg: finalQty ? (invested + cost) / finalQty : 0,
    };
  });

  const targetList = active.map((item) => targets[item.symbol]);
  const targetMin = targetList.length ? Math.min(...targetList) : 0;
  const targetMax = targetList.length ? Math.max(...targetList) : 0;

  return {
    target: targetMax,
    targetMin,
    targetMax,
    targetVaries: targetMax - targetMin > EPSILON,
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
