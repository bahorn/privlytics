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

/* Quickly generate a UUID. This isn't cryptographically secure, but that 
 * isn't relevant for this use case.
 * This comes from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * */
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/* Get what we care about from the users browsers during the initial load */
const getStats = () => {
  const { browser } = new UAParser().getResult()
  return {
    'host': new URL(document.referrer).hostname,
    'browser': {
      'version': browser['major'] || null,
      'name': browser['name'] || null
    }
  }
}

/* Leave Event */
const leaveEvent = (args) => {
  const { startDate } = args;
  return {
    'time': new Date() - startDate 
  }
}

/* Send statistics to the remote endpoint */
const provideToCollector = (endpoint, stats) => {
  if (endpoint) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(stats));
  } else {
    /* For local development. */  
    console.log(stats)
  }

}

/* Adds this sessions UUID to the dict, so we can link stats to values
 * fired on other events. */
const wrapUUID = (uuid, f) => {
  return (args) => {
    const res = f(args)
    res['uuid'] = uuid
    return res
  }
}

/* Wraps functions to they can be provided to browser events.
 * Use args to pass down values that need to be generated at the start.
 */
const provide = (state, f, args) => {
  const { endpoint, uuid } = state;
  return (e) => {
    /* We can implement checks on the event here if we care. */
    provideToCollector(endpoint, wrapUUID(uuid, f)(args))
  }
}


/* Hook events like onunload so we can get page view time */
const addHandlers = (state) => {
  window.addEventListener('unload',
    provide(state, leaveEvent, { startDate: new Date()})
  )
}

const privlytics = (endpoint, sample_size=0.1) => {
  /* We only run when the user hasn't enabled DNT */
  if (isDNTEnabled()) {
    return
  }
  /* We can now continue to check if the request is going to be sampled. */
  if (Math.random() > sample_size) {
    return
  }

  /* We pass this down our tree of events. All these values are static and
   * defined here */
  const state = {
    'uuid': uuidv4(),
    'endpoint': endpoint
  }

  /* Setup our event handlers */
  addHandlers(state)

  /* Initial Stats */
  provide(state, getStats)()
}
