const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw(err)
    } else {
      // debugger;
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filePath, text, (err, result) => {
        if (err) {
          throw (err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, {encoding: 'utf-8'}, (err, results) => {
    var data = _.map(results, (fileName) => {
      var id = fileName.slice(0, -4);
      var text = fs.readFileSync(path.join(exports.dataDir, `${id}.txt`), {encoding: 'utf-8'});
      return {id, text};
    });
    console.log(data);
    callback(null, data);
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), {encoding: 'utf-8'}, (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), {encoding: 'utf-8'}, (err, results) => {
    if (!results) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, text) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), {encoding: 'utf-8'}, (err, results) => {
    if (!results) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.rm(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
