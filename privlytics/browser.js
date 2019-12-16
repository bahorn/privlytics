/* Check if DNT is enabled, using the trick described here:
 * https://dev.to/corbindavenport/how-to-correctly-check-for-do-not-track-with-javascript-135d
 * as browsers don't have a uniform way of detecting it. */
const isDNTEnabled = () => {
  if (window.doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || 'msTrackingProtectionEnabled' in window.external) {
    if (window.doNotTrack == "1" || navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1" || window.external.msTrackingProtectionEnabled()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/* Pass JSON via a POST request */
const sendJSON = (endpoint, json) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(json));
}

export {
  isDNTEnabled,
  sendJSON
}
