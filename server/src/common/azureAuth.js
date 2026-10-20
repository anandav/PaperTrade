const { DefaultAzureCredential } = require("@azure/identity");

const COGNITIVE_SCOPE = "https://cognitiveservices.azure.com/.default";

let credential = null;

function getCredential() {
  if (!credential) {
    credential = new DefaultAzureCredential();
  }
  return credential;
}

async function getCognitiveToken() {
  const token = await getCredential().getToken(COGNITIVE_SCOPE);
  return token.token;
}

module.exports = { COGNITIVE_SCOPE, getCredential, getCognitiveToken };
