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
        _data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            const hashedPassword = encryptor.hash(password);
            if (hashedPassword == userData.password) {
              const tokenId = randomString.create(20);
              const expires = Date.now() + 1000 * 60 * 60;
              const tokenObj = {
                phone: phone,
                tokenId: tokenId,
                expired: expires,
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
    get: (data, callback) => {},
    put: (data, callback) => {},
    delete: (data, callback) => {},
  };
})();

module.exports = tokens;
