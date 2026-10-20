const { OpenAI } = require("openai");
const { getBearerTokenProvider } = require("@azure/identity");
const ApiError = require("./ApiError");
const logger = require("./logs");
const { COGNITIVE_SCOPE, getCredential } = require("./azureAuth");

let client = null;
let clientEndpoint = null;

function getClient() {
  const endpoint = global.appConfig.azureOpenAIEndpoint;
  if (!client || clientEndpoint !== endpoint) {
    client = new OpenAI({
      baseURL: endpoint,
      apiKey: getBearerTokenProvider(getCredential(), COGNITIVE_SCOPE),
    });
    clientEndpoint = endpoint;
  }
  return client;
}

function isContentFiltered(err) {
  return !!err && err.status === 400 && (err.code === "content_filter" || /content management policy/i.test(String(err.message || "")));
}

async function extract({ schema, schemaName, instructions, text }) {
  let response;
  try {
    response = await getClient().responses.create({
      model: global.appConfig.azureOpenAIDeployment,
      instructions,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: `<document>\n${text}\n</document>` }],
        },
      ],
      reasoning: { effort: "low" },
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          schema,
          strict: true,
        },
      },
    });
  } catch (err) {
    logger.error("Document extraction request failed", { status: err && err.status, code: err && err.code, message: err && err.message });
    if (isContentFiltered(err)) {
      throw new ApiError(400, "The document was blocked by the content safety check. Remove any text that is not holdings or positions data and try again.");
    }
    throw new ApiError(502, "Could not extract data from the document. Try again later.");
  }

  logger.debug("Document extraction usage", response.usage);

  if (response.status !== "completed" || !response.output_text) {
    logger.warn("Document extraction incomplete", { status: response.status, details: response.incomplete_details });
    throw new ApiError(502, "The document was too large or unclear to read. Try a smaller file.");
  }

  try {
    return JSON.parse(response.output_text);
  } catch (err) {
    logger.warn("Document extraction returned invalid JSON");
    throw new ApiError(502, "Could not extract data from the document. Try again later.");
  }
}

module.exports = { extract };
