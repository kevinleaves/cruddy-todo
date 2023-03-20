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
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf-8', (err, textContent) => {
    if (err) {
      callback(err)
    } else {
      let todo = {id: id, text: textContent}
      callback(null, todo)
    }
  })
};

exports.update = (id, text, callback) => {
  // if valid id, update
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf-8', (err) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text,'utf-8', (err) => {
        if (err) {
          callback(err)
        } else {
          console.log(id, text)
          let newTodo = {id: id, text: text}
          callback(newTodo)
        }
      })
    }
  })
};

exports.delete = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf-8', (err, text) => {
    if (err) {
      callback(err)
    } else {
      fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      })
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
