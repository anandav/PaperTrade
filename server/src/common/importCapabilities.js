const DEFAULT_MAX_MB = 5;

const FORMAT_LABELS = {
  csv: "CSV",
  xlsx: "XLSX",
  pdf: "PDF",
};

function docIntelReady(config) {
  return !!(config.enableDocIntel && config.azureDocIntelEndpoint);
}

function getImportCapabilities(config = global.appConfig || {}) {
  const formats = docIntelReady(config) ? ["csv", "xlsx", "pdf"] : ["csv"];
  const maxMb = Number.isInteger(config.docImportMaxMb) && config.docImportMaxMb > 0
    ? config.docImportMaxMb
    : DEFAULT_MAX_MB;
  const labels = formats.map((f) => FORMAT_LABELS[f]).join(", ");
  return {
    enabled: !!(config.enableDocImport && config.azureOpenAIEndpoint && !config.enableDemo),
    formats,
    maxMb,
    message: formats.length === 1 ? `Supported format: ${labels}` : `Supported formats: ${labels}`,
  };
}

module.exports = { getImportCapabilities };
