/**
 * Allows you to run a callback function on each item in an array at whatever
 * pace you want.  It wraps it in a object where you can just call .next() to
 * run the callback on the next item in the array. 
 * @param {[type]}   arr [description]
 * @param {Function} cb  [description]
 */
module.exports = function SlowEach(arr, cb){
  var pos = 0;

  var next = function(){
    if (pos < arr.length) {
      cb(arr[pos]);
      pos++;
    }
  };

  return {
    next: next
  };
}