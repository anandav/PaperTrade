const express = require("express");
const splitplancontroller = express.Router();
const SplitPlan = require("../models/splitplan");
const commonUtility = require("../models/commonUtility");
const ApiError = require("../common/ApiError");
const logger = require("../common/logs");

const activeFilter = commonUtility.activeFilter;
const SYMBOL_PATTERN = /^[A-Z0-9&_.-]{1,20}$/;
const MAX_ITEMS = 100;
const MAX_QUOTES = 50;
const QUOTE_BATCH = 4;

function normalizeSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^NSE:/, "");
}

function positiveOrZero(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sanitizeItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const symbol = normalizeSymbol(item && item.symbol);
    if (!SYMBOL_PATTERN.test(symbol) || seen.has(symbol)) {
      continue;
    }
    seen.add(symbol);
    result.push({
      symbol,
      price: positiveOrZero(item.price),
      lasttradedprice: positiveOrZero(item.lasttradedprice),
      included: item.included !== false,
    });
  }
  if (result.length > MAX_ITEMS) {
    throw new ApiError(400, `A plan can have at most ${MAX_ITEMS} stocks.`);
  }
  return result;
}

async function listPlans(userId) {
  return SplitPlan.find({ userId, ...activeFilter }).sort({ modifiedon: -1 });
}

splitplancontroller.get("/", async (req, res) => {
  res.json(await listPlans(req.user._id));
});

splitplancontroller.post("/save", async (req, res) => {
  if (global.appConfig && global.appConfig.enableDemo) {
    throw new ApiError(401, "Cant save split plan on demo mode.");
  }

  const { _id, name, amount, useleftover, items } = req.body || {};
  const cleanName = String(name || "").trim().slice(0, 80) || "Untitled plan";
  const cleanAmount = Number(amount);
  if (!Number.isFinite(cleanAmount) || cleanAmount < 0) {
    throw new ApiError(400, "Amount must be a positive number.");
  }
  const cleanItems = sanitizeItems(items);

  let plan;
  if (_id) {
    plan = await SplitPlan.findOne({
      _id,
      userId: req.user._id,
      ...activeFilter,
    });
    if (!plan) {
      throw new ApiError(404, "Split plan not found or unauthorized.");
    }
  } else {
    plan = new SplitPlan({
      userId: req.user._id,
      isactive: true,
      createdon: new Date(),
    });
  }
  plan.name = cleanName;
  plan.amount = cleanAmount;
  plan.useleftover = useleftover !== false;
  plan.items = cleanItems;
  plan.modifiedon = new Date();

  const saved = await plan.save();
  res.json({ plan: saved, plans: await listPlans(req.user._id) });
});

splitplancontroller.post("/delete", async (req, res) => {
  const pid = req.body && (req.body._id || req.body.id);
  if (!pid) {
    throw new ApiError(400, "Split plan ID (_id) is required.");
  }
  if (global.appConfig && global.appConfig.enableDemo) {
    throw new ApiError(401, "Cant delete split plan on demo mode.");
  }

  const plan = await SplitPlan.findOne({
    _id: pid,
    userId: req.user._id,
    ...activeFilter,
  });
  if (!plan) {
    throw new ApiError(404, "Split plan not found or unauthorized.");
  }
  plan.isactive = false;
  plan.modifiedon = new Date();
  await plan.save();
  res.json({ plans: await listPlans(req.user._id) });
});

async function fetchQuote(nse, symbol) {
  try {
    const data = await nse.GetEquitiyDetail(symbol);
    const lastPrice = data && data.priceInfo ? Number(data.priceInfo.lastPrice) : NaN;
    if (!Number.isFinite(lastPrice) || lastPrice <= 0) {
      return { symbol, lastPrice: null, error: "No NSE price found for this symbol." };
    }
    return {
      symbol,
      lastPrice,
      companyName: (data.info && data.info.companyName) || "",
    };
  } catch (err) {
    logger.warn("Split plan quote failed", { symbol, message: err && err.message });
    return { symbol, lastPrice: null, error: "Could not reach NSE for this symbol." };
  }
}

splitplancontroller.post("/quotes", async (req, res) => {
  if (!(global.appConfig && global.appConfig.enableDataApi)) {
    throw new ApiError(503, "Live prices are turned off on this server. Enter prices by hand.");
  }
  const raw = Array.isArray(req.body && req.body.symbols) ? req.body.symbols : [];
  const symbols = [...new Set(raw.map(normalizeSymbol))].filter((s) =>
    SYMBOL_PATTERN.test(s)
  );
  if (!symbols.length) {
    throw new ApiError(400, "Send at least one valid NSE symbol.");
  }
  if (symbols.length > MAX_QUOTES) {
    throw new ApiError(400, `Ask for at most ${MAX_QUOTES} symbols at a time.`);
  }

  const nse = require("../dataprovidercontroller/nse");
  const quotes = [];
  for (let i = 0; i < symbols.length; i += QUOTE_BATCH) {
    const batch = symbols.slice(i, i + QUOTE_BATCH);
    quotes.push(...(await Promise.all(batch.map((s) => fetchQuote(nse, s)))));
  }
  res.json({ quotes, fetchedon: new Date() });
});

module.exports = splitplancontroller;
