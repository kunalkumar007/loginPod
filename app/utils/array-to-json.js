//create JSON object from 2 dimensional Array
export default function arrToObject(arr) {
  //assuming header
  var keys = arr[0];
  //vacate keys from main array
  var newArr = arr.slice(1, arr.length);

  var formatted = [],
    data = newArr,
    cols = keys,
    l = cols.length;
  for (var i = 0; i < data.length; i++) {
    var d = data[i],
      o = {};
    for (var j = 0; j < l; j++) {
      if (d[j] !== undefined) {
        o[cols[j]] = d[j];
      } else {
        o[cols[j]] = null;
      }
    }
    formatted.push(o);
  }
  return formatted;
}
