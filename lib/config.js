const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  name: "staging",
  salt: "SALTSALTSALT",
  maxChecks: 5,
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  name: "production",
  salt: "SALTSALTSALT",
  maxChecks: 5,
};

const currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const envToExport =
  typeof environments[currentEnv] == "object"
    ? environments[currentEnv]
    : environments.staging;

module.exports = envToExport;
