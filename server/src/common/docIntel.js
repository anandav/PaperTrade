const ApiError = require("./ApiError");
const logger = require("./logs");
const { getCognitiveToken } = require("./azureAuth");

const API_VERSION = "2024-11-30";
const POLL_TIMEOUT_MS = 60000;
const DEFAULT_RETRY_MS = 1000;

function readFailed() {
  return new ApiError(502, "Could not read the document. Try again or upload a CSV.");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryAfterMs(response) {
  const seconds = Number(response.headers.get("retry-after"));
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds * 1000, 5000) : DEFAULT_RETRY_MS;
}

async function analyzeLayout(buffer) {
  const endpoint = String(global.appConfig.azureDocIntelEndpoint || "").replace(/\/+$/, "");
  const token = await getCognitiveToken();
  const url = `${endpoint}/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=${API_VERSION}&outputContentFormat=markdown`;

  const start = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ base64Source: buffer.toString("base64") }),
  });
  if (start.status !== 202) {
    const body = await start.text().catch(() => "");
    logger.warn("Document Intelligence analyze rejected", { status: start.status, body: body.slice(0, 500) });
    throw readFailed();
  }

  const operationUrl = start.headers.get("operation-location");
  if (!operationUrl) {
    throw readFailed();
  }

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let wait = retryAfterMs(start);
  while (Date.now() < deadline) {
    await sleep(wait);
    const poll = await fetch(operationUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!poll.ok) {
      logger.warn("Document Intelligence poll failed", { status: poll.status });
      throw readFailed();
    }
    const result = await poll.json();
    if (result.status === "succeeded") {
      const content = result.analyzeResult && result.analyzeResult.content;
      logger.debug("Document Intelligence pages:", (result.analyzeResult && result.analyzeResult.pages || []).length);
      return String(content || "");
    }
    if (result.status === "failed") {
      logger.warn("Document Intelligence analyze failed", result.error);
      throw readFailed();
    }
    wait = retryAfterMs(poll);
  }
  logger.warn("Document Intelligence analyze timed out");
  throw readFailed();
}

module.exports = { analyzeLayout };
