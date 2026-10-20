const path = require("path");
const ApiError = require("./ApiError");
const { getImportCapabilities } = require("./importCapabilities");
const { analyzeLayout } = require("./docIntel");

const MAX_TEXT_CHARS = 60000;
const SNIFF_BYTES = 8192;

function detectType(file) {
  const ext = path.extname(String(file.originalname || "")).toLowerCase().replace(".", "");
  const head = file.buffer.subarray(0, SNIFF_BYTES);
  if (ext === "pdf" && head.subarray(0, 4).toString("latin1") === "%PDF") {
    return "pdf";
  }
  if (ext === "xlsx" && head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04) {
    return "xlsx";
  }
  if (ext === "csv" && head.length > 0 && !head.includes(0)) {
    return "csv";
  }
  return null;
}

function isEncryptedPdf(buffer) {
  return /\/Encrypt\s/.test(buffer.toString("latin1"));
}

function truncate(text, warnings) {
  if (text.length <= MAX_TEXT_CHARS) {
    return text;
  }
  warnings.push("The document is long, so only the first part was read. Split it into smaller files if rows are missing.");
  return text.slice(0, MAX_TEXT_CHARS);
}

async function readDocument(file) {
  if (!file || !file.buffer || !file.buffer.length) {
    throw new ApiError(400, "Choose a file to upload.");
  }
  const capabilities = getImportCapabilities();
  const type = detectType(file);
  if (!type || !capabilities.formats.includes(type)) {
    throw new ApiError(400, capabilities.message);
  }

  const warnings = [];
  if (type === "csv") {
    const text = file.buffer.toString("utf8").replace(/^﻿/, "");
    return { type, text: truncate(text, warnings), warnings };
  }

  if (type === "pdf" && isEncryptedPdf(file.buffer)) {
    throw new ApiError(400, "This PDF is password protected. Remove the password and upload again.");
  }
  const text = await analyzeLayout(file.buffer);
  if (!text.trim()) {
    throw new ApiError(400, "No readable text was found in this document.");
  }
  return { type, text: truncate(text, warnings), warnings };
}

module.exports = { readDocument };
