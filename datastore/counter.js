const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird')

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // read current id
  readCounter((err, counter) => {
    if (err) {
      callback(err)
    } else {
      // once we have counter, take it and increment by 1 return that id
      counter = counter + 1
      // write the new counter to storage
      writeCounter(counter, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          callback(null, result)
        }
      })
    }
  });

  return zeroPaddedNumber(counter);
};

// exports.getNextUniqueId = () => {
//   return new Promise ((resolve, reject) => {
//     readCounter((err, counter) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(counter + 1)
//       }
//     })
//   })
//   .then ((counter, (err, result) => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve(result)
//     }
//   }))
//   .then((counter) => {
//     return zeroPaddedNumber(counter)
//   })
//   .catch((err) => {
//     return err
//   })
// }

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
