const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');

Promise.promisifyAll(fs);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = () => {

  return new Promise((resolve, reject) => {
    fs.readFileAsync(exports.counterFile).then((data) => {
      resolve(Number(data))
    }).catch((err) => reject(err));
  });
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
};

const writeCounter = (count) => {
  var counterString = zeroPaddedNumber(count);

  return new Promise((resolve, reject) => {
    fs.writeFileAsync(exports.counterFile, counterString)
    .then (() => {
      resolve(counterString);
    })
    .catch((err) => {
      reject(err);
    })
  })

  // fs.writeFile(exports.counterFile, counterString, (err) => {
  //   if (err) {
  //     throw ('error writing counter');
  //   } else {
  //     callback(null, counterString);
  //   }
  // });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = () => {
  //Read counter
  return new Promise((resolve, reject) => {
    readCounter().then(counter => writeCounter(++counter))
    .then((result) => {
      resolve(zeroPaddedNumber(result));
    }).catch((err) => reject(err));
  });
  // readCounter((err, counter) => {
  //   writeCounter(counter + 1, (err, result) => {
  //     callback(null, result);
  //   });
  // });
    //If error
      //Call callback with error as first argument
    //Else
      //Set counter to itself plus one
      //Write counter with new counter
        //If error
          //Call callback with error as first argument
        //Else
          //Call callback with null for first and counter as second argument
  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
