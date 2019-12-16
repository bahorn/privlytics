import { sendJSON } from './browser'

/* Send statistics to the remote endpoint */
const provideToCollector = (endpoint, stats) => {
  console.log(endpoint, stats);
  if (endpoint) {
    sendJSON(endpoint, stats)
  } else {
    /* For local development. */  
    console.log(stats)
  }
}

/* Adds this sessions UUID to the dict, so we can link stats to values
 * fired on other events. */
const wrapRequired = (uuid, site_id, f) => {
  return (args) => {
    const res = f(args)
    res['uuid'] = uuid
    res['site_id'] = site_id
    return res
  }
}

/* Wraps functions to they can be provided to browser events.
 * Use args to pass down values that need to be generated at the start.
 */
const provide = (state, f, args) => {
  const { endpoint, uuid, site_id } = state;
  return (e) => {
    /* We can implement checks on the event here if we care. */
    provideToCollector(endpoint, wrapRequired(uuid, site_id, f)(args))
  }
}

export {
  provide
}
