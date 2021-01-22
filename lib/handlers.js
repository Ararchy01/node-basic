const acceptableMethods = ["post", "get", "put", "delete"];
const _users = require("./users");
const _tokens = require("./tokens");

const handlers = (() => {
  return {
    ping: (data, callback) => {
      callback(200);
    },
    hello: (data, callback) => {
      callback(406, { greeting: "Hello world" });
    },
    users: (data, callback) => {
      if (acceptableMethods.includes(data.method)) {
        _users[data.method](data, callback);
      } else {
        callback(405);
      }
    },
    tokens: (data, callback) => {
      if (acceptableMethods.includes(data.method)) {
        _tokens[data.method](data, callback);
      } else {
        callback(405);
      }
    },
    notFound: (data, callback) => {
      callback(404);
    },
  };
})();

module.exports = handlers;
