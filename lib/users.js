const _data = require("./data");
const encryptor = require("./encryptor");
const tokens = require("./tokens");

const users = (() => {
  return {
    post: (data, callback) => {
      const _firstname = data.payload.firstname;
      const _lastname = data.payload.lastname;
      const _phone = data.payload.phone;
      const _password = data.payload.password;
      const _tosAgreement = data.payload.tosAgreement;

      const firstname =
        typeof _firstname == "string" && _firstname.trim().length > 0
          ? _firstname.trim()
          : false;
      const lastname =
        typeof _lastname == "string" && _lastname.trim().length > 0
          ? _lastname.trim()
          : false;
      const phone =
        typeof _phone == "string" && _phone.trim().length == 10
          ? _phone.trim()
          : false;
      const password =
        typeof _password == "string" && _password.trim().length > 0
          ? _password.trim()
          : false;
      const tosAgreement =
        typeof _tosAgreement == "boolean" ? _tosAgreement : false;

      console.log(_firstname, _lastname, _phone, _password, _tosAgreement);
      console.log(typeof _firstname);
      console.log(firstname, lastname, phone, password, tosAgreement);
      if (firstname && lastname && phone && password && tosAgreement) {
        _data.read("users", phone, (err, data) => {
          if (err) {
            const hashedPassword = encryptor.hash(password);

            if (!hashedPassword) {
              callback(500, { Error: "Could not hash the password" });
            }
            const user = {
              firstname: firstname,
              lastname: lastname,
              phone: phone,
              password: hashedPassword,
              tosAgreement: tosAgreement,
            };

            _data.create("users", phone, user, (err) => {
              if (err) {
                console.log(err);
                callback(500, { Error: "Could not create the new user" });
              }
              callback(200);
            });
          } else {
            callback(400, { Error: "Phone number already exists" });
          }
        });
      } else {
        callback(400, { Error: "Missing required field" });
      }
    },
    get: (data, callback) => {
      const phone =
        typeof data.queryStringObject.phone == "string" &&
        data.queryStringObject.phone.trim().length == 10
          ? data.queryStringObject.phone.trim()
          : false;
      if (phone) {
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;

        tokens.verify(token, phone, (isValid) => {
          if (isValid) {
            _data.read("users", phone, (err, data) => {
              if (!err && data) {
                delete data.password;
                callback(200, data);
              } else {
                callback(400, { Error: "Could not read the user data" });
              }
            });
          } else {
            callback(403, {
              Error: "Missing required token in headers, or token has expired",
            });
          }
        });
      } else {
        callback(400, { Error: "Missing required field" });
      }
    },
    put: (data, callback) => {
      const _phone = data.payload.phone;
      const _firstname = data.payload.firstname;
      const _lastname = data.payload.lastname;
      const _password = data.payload.password;

      const phone =
        typeof _phone == "string" && _phone.trim().length == 10
          ? _phone.trim()
          : false;
      const firstname =
        typeof _firstname == "string" && _firstname.trim().length > 0
          ? _firstname.trim()
          : false;
      const lastname =
        typeof _lastname == "string" && _lastname.trim().length > 0
          ? _lastname.trim()
          : false;
      const password =
        typeof _password == "string" && _password.trim().length > 0
          ? _password.trim()
          : false;

      if (phone) {
        if (firstname || lastname || password) {
          const token =
            typeof data.headers.token == "string" ? data.headers.token : false;

          tokens.verify(token, phone, (isValid) => {
            if (isValid) {
              _data.read("users", phone, (err, userData) => {
                if (!err && userData) {
                  if (firstname) {
                    userData.firstname = firstname;
                  }
                  if (lastname) {
                    userData.lastname = lastname;
                  }
                  if (password) {
                    userData.password = encryptor.hash(password);
                  }
                  _data.update("users", phone, userData, (err) => {
                    if (!err) {
                      callback(200);
                    } else {
                      callback(500, {
                        Error: "Could not update the user data",
                      });
                    }
                  });
                } else {
                  callback(400, { Error: "The specified user does not exist" });
                }
              });
            } else {
              callback(403, {
                Error:
                  "Missing required token in headers, or token has expired",
              });
            }
          });
        } else {
          callback(400, { Error: "Missing fields to update" });
        }
      } else {
        callback(400, { Error: "Missing required field" });
      }
    },
    delete: (data, callback) => {
      const phone =
        typeof data.queryStringObject.phone == "string" &&
        data.queryStringObject.phone.trim().length == 10
          ? data.queryStringObject.phone.trim()
          : false;
      if (phone) {
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;

        tokens.verify(token, phone, (isValid) => {
          if (isValid) {
            _data.read("users", phone, (err, data) => {
              if (!err && data) {
                _data.delete("users", phone, (err) => {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, { Error: "Could not delete the user data" });
                  }
                });
              } else {
                callback(400, { Error: "Could not read the user data" });
              }
            });
          } else {
            callback(403, {
              Error: "Missing required token in headers, or token has expired",
            });
          }
        });
      } else {
        callback(400, { Error: "Missing required field" });
      }
    },
  };
})();

module.exports = users;
