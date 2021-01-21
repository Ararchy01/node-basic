const crypto = require("crypto");
const config = require("./config");

const encryptor = (() => {
  return {
    hash: (original) => {
      if (typeof original == "string" && original.length > 0) {
        return crypto
          .createHmac("sha256", config.salt)
          .update(original)
          .digest("hex");
      } else {
        return false;
      }
    },
  };
})();

module.exports = encryptor;
