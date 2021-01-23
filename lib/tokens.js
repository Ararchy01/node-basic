const _data = require("./data");
const encryptor = require("./encryptor");
const randomString = require("./randomString");

const tokens = (() => {
  return {
    post: (data, callback) => {
      const _phone = data.payload.phone;
      const _password = data.payload.password;

      const phone =
        typeof _phone == "string" && _phone.trim().length == 10
          ? _phone.trim()
          : false;
      const password =
        typeof _password == "string" && _password.trim().length > 0
          ? _password.trim()
          : false;

      if (phone && password) {
        _data.read("users", phone, (err, tokenData) => {
          if (!err && tokenData) {
            const hashedPassword = encryptor.hash(password);
            if (hashedPassword == tokenData.password) {
              const tokenId = randomString.create(20);
              const expires = Date.now() + 1000 * 60 * 60;
              const tokenObj = {
                phone: phone,
                tokenId: tokenId,
                expires: expires,
              };
              _data.create("tokens", tokenId, tokenObj, (err) => {
                if (err) {
                  callback(500, { Error: "Could not create the new token" });
                } else {
                  callback(200, tokenObj);
                }
              });
            } else {
              callback(400, {
                Error: "Password did not match the stored password",
              });
            }
          } else {
            callback(400, { Error: "Could not find the specified user" });
          }
        });
      } else {
        callback(400, { Error: "Missing required fields" });
      }
    },
    get: (data, callback) => {
      const _id = data.payload.phone;

      const id =
        typeof _id == "string" && _id.trim().length == 20 ? _id.trim() : false;
      if (id) {
        _data.read("tokens", id, (err, tokenData) => {
          if (!err && tokenData) {
            callback(200, tokenData);
          } else {
            callback(400, { Error: "Could not read the user data" });
          }
        });
      } else {
        callback(400, { Error: "Missing required field" });
      }
    },
    put: (data, callback) => {
      const _id = data.payload.id;
      const _isExtend = data.payload.isExtend;

      const id =
        typeof _id == "string" && _id.trim().length == 20 ? _id.trim() : false;
      const isExtend = typeof _isExtend == "boolean" && _isExtend;

      if (id && isExtend) {
        _data.read("tokens", id, (err, tokenData) => {
          if (!err && tokenData) {
            if (tokenData.expires > Date.now()) {
              tokenData.expires = Date.now() + 1000 * 60 * 60;
              _data.update("tokens", id, tokenData, (err) => {
                if (err) {
                  callback(500, {
                    Error: "Could not update the token expiration",
                  });
                } else {
                  callback(200, tokenData);
                }
              });
            } else {
              callback(400, {
                Error: "The specified token has already expired",
              });
            }
          } else {
            callback(400, { Error: "Could not find the specified token data" });
          }
        });
      } else {
        callback(400, { Error: "Missing required fields" });
      }
    },
    delete: (data, callback) => {
      const _id = data.queryStringObject.id;
      const id =
        typeof _id == "string" && _id.trim().length == 20 ? _id.trim() : false;

      if (id) {
        _data.delete("tokens", id, (err) => {
          if (err) {
            callback(500, { Error: "Could not the token" });
          } else {
            callback(200);
          }
        });
      } else {
        callback(400, { Error: "Missing required fields" });
      }
    },
  };
})();

module.exports = tokens;
