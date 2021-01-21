const parser = (() => {
  return {
    jsonToObj: (str) => {
      try {
        const obj = JSON.parse(str);
        return obj;
      } catch (error) {
        return {};
      }
    },
  };
})();

module.exports = parser;
