const config = require("./config");
const _data = require("./data");
const randomString = require("./randomString");

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
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        _data.read("tokens", token, (err, tokenData) => {
          if (!err && tokenData) {
            const userPhone = tokenData.phone;
            _data.read("users", userPhone, (err, userData) => {
              if (!err && userData) {
                const userChecks =
                  typeof userData.checks == "object" &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];
                if (userChecks.length < config.maxChecks) {
                  const checkId = randomString.create(20);
                  const checkObject = {
                    id: checkId,
                    userPhone: userPhone,
                    protocol: protocol,
                    url: url,
                    method: method,
                    successCodes: successCodes,
                    timeoutSeconds: timeoutSeconds,
                  };
                  _data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      userData.checks = userChecks;
                      userData.checks.push(checkId);
                      _data.update("users", userPhone, userData, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            Error: "Could not update the user with new check",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "Could not create the new check",
                      });
                    }
                  });
                } else {
                  callback(400, {
                    Error: "The user already has the maximum number of checks ",
                  });
                }
              } else {
                callback(403);
              }
            });
          } else {
            callback(403);
          }
        });
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
