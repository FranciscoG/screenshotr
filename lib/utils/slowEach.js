/**
 * Allows you to run a callback function on each item in an array at whatever
 * pace you want.  It wraps it in a object where you can just call .next() to
 * run the callback on the next item in the array.
 * @param {unknown[]} arr array of items to iterate over
 * @param {function} cb callack function to 
 */
export default function SlowEach(arr, cb) {
  let index = 0;

  const next = () => {
    if (index < arr.length) {
      cb(arr[index], index, arr);
      index++;
    }
  };

  return {
    next,
  };
};
