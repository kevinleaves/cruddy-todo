const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird')

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
// exports.create = function (text) {
//   return new Promise((resolve, reject) => {

//   })
// }

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(path.join(exports.dataDir, `/${id}.txt`), text, 'utf-8',(err) => {
        if (err) {
          callback(err)
        } else {
          let todo = {id, text}
          callback(null, todo)
        }
      })
    }
  })
};

exports.readAll = (callback) => {
  fs.readdir(path.join(exports.dataDir), 'utf-8', (err, fileNames) => {
    if (err) {
      callback(err)
    } else {
      let data = fileNames.map((file) => {
        id = file.slice(0, -4)
        let obj = {id: id, text: id}
        return obj
      })
      callback(null, data)
    }
  })
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
