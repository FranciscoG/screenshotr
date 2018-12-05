/**
 * Takes an array and splits it into multiple arrays of a specified lengths
 * @param  {Number} chunkSize the size of each array
 * @return {Array}           An array of arrays
 */
Array.prototype.chunk = function(chunkSize) {
  var arr = [];
  if (this.length <= chunkSize){ 
    return [this];
  }
  for (var i=0; i<this.length; i+=chunkSize) {
    arr.push(this.slice(i,i+chunkSize));
  }
  return arr;
};
