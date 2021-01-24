const config = require("./config");

const acceptableProtocols = ["http", "https"];
const acceptableMethods = ["post", "get", "put", "delete"];

const checks = (() => {
  return {
    post: (data, callback) => {
      const _protocol = data.payload.protocol;
      const _url = data.payload.url;
      const _method = data.payload.method;
      const _successCodes = data.payload.successCodes;
      const _timeoutSeconds = data.payload.timeoutSeconds;

      const protocol =
        typeof _protocol == "string" && acceptableProtocols.includes(_protocol)
          ? _protocol
          : false;
      const url =
        typeof _url == "string" && _url.trim().length > 0 ? _url : false;
      const method =
        typeof _method == "string" && acceptableMethods.includes(_method)
          ? _method
          : false;
      const successCodes =
        typeof _successCodes == "object" &&
        _successCodes instanceof Array &&
        _successCodes.length > 0
          ? _successCodes
          : false;
      const timeoutSeconds =
        typeof _timeoutSeconds == "number" &&
        _timeoutSeconds % 1 === 0 &&
        _timeoutSeconds >= 1 &&
        _timeoutSeconds <= 5
          ? _timeoutSeconds
          : false;

      if (protocol && url && method && successCodes && timeoutSeconds) {
      } else {
        callback(400, {
          Error: "Missing required inputs or inputs are invalid",
        });
      }
    },
    get: (data, callback) => {},
    put: (data, callback) => {},
    delete: (data, callback) => {},
  };
})();

module.exports = checks;
