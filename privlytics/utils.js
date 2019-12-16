/* Random function. Split so I can develop tests */
const randomSample = () => {
  return Math.random()
}

/* Quickly generate a UUID. This isn't cryptographically secure, but that 
 * isn't relevant for this use case.
 * This comes from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * */
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = randomSample() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export {
  randomSample,
  uuidv4
}
