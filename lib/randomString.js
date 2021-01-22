const randomString = (() => {
  return {
    create: (length) => {
      length = typeof length == "number" && length > 0 ? length : false;
      if (length) {
        const possibleChars =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let str = "";
        for (i = 0; i < length; i++) {
          const random = possibleChars.charAt(
            Math.floor(Math.random() * possibleChars.length)
          );
          str += random;
        }
        return str;
      } else {
        return false;
      }
    },
  };
})();

module.exports = randomString;
