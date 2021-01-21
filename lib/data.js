const fs = require("fs");
const path = require("path");
const parser = require("./parser");

const lib = {};

lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (err || !fileDescriptor) {
        callback("Could not create new file, it may already exist");
      }
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (err) {
          callback("Error writing to the file");
        }
        fs.close(fileDescriptor, (err) => {
          if (err) {
            callback("Error closing the file");
          }
          callback(false);
        });
      });
    }
  );
};

lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    (err, data) => {
      if (!err && data) {
        const parsedData = parser.jsonToObj(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

lib.update = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (err || !fileDescriptor) {
        callback("Could not create new file, it may already exist");
      }
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err) => {
        if (err) {
          callback("Error writing to the file");
        }
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (err) {
            callback("Error writing to the file");
          }
          fs.close(fileDescriptor, (err) => {
            if (err) {
              callback("Error closing the file");
            }
            callback(false);
          });
        });
      });
    }
  );
};

lib.delete = (dir, file, callback) => {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("File deleted");
    }
  });
};

module.exports = lib;
