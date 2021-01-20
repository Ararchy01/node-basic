const _data = require("./data");
const encryptor = require("./encryptor");

const handlers = (() => {
  return {
    ping: (data, callback) => {
      callback(200);
    },
    hello: (data, callback) => {
      callback(406, { greeting: "Hello world" });
    },
    users: (data, callback) => {
      if (["post", "get", "put", "delete"].includes(data.method)) {
        _users[data.method](data, callback);
      } else {
        callback(405);
      }
    },
    notFound: (data, callback) => {
      callback(404);
    },
  };
})();

const _users = (() => {
  return {
    post: (data, callback) => {
      const _firstname = data.payload.firstname;
      const _lastname = data.payload.lastname;
      const _phone = data.payload.phone;
      const _password = data.payload.password;
      const _tosAgreement = data.payload.tosAgreement;

      const firstname =
        typeof _firstname == "string" && _firstname.trim() > 0
          ? _firstname.trim()
          : false;
      const lastname =
        typeof _lastname == "string" && _lastname.trim() > 0
          ? _lastname.trim()
          : false;
      const phone =
        typeof _phone == "string" && _phone.trim() == 10
          ? _phone.trim()
          : false;
      const password =
        typeof _password == "string" && _password.trim() > 0
          ? _password.trim()
          : false;
      const tosAgreement =
        typeof _tosAgreement == "boolean" ? _tosAgreement : false;

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

            _data.create("user", phone, user, (err) => {
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
    get: (data, callback) => {},
    put: (data, callback) => {},
    delete: (data, callback) => {},
  };
})();

module.exports = handlers;
