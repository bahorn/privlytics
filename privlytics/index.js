import UAParser from 'ua-parser-js'

import { PrivlyticsEnum } from './constants'
import { isDNTEnabled, sendJSON } from './browser'
import { randomSample, uuidv4 } from './utils'

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

/* Hook events like onunload so we can get page view time */
const addHandlers = (state) => {
  window.addEventListener('unload',
    provide(state, leaveEvent, { startDate: new Date()})
  )
}

const privlytics = (site_id, endpoint, sample_size=0.1) => {
  /* Require site_id to be set so you can filter your logs properly. */
  if (!site_id) {
    console.error('[privlytics] missing required parameter siteId')
    return PrivlyticsEnum.MISSING_SITE_ID
  }

  /* We only run when the user hasn't enabled DNT */
  if (isDNTEnabled()) {
    return PrivlyticsEnum.DNT_ENABLED
  }
  /* We can now continue to check if the request is going to be sampled. */
  if (randomSample() > sample_size) {
    return PrivlyticsEnum.NOT_SAMPLED
  }

  /* We pass this down our tree of events. All these values are static and
   * defined here */
  const state = {
    'uuid': uuidv4(),
    'endpoint': endpoint,
    'site_id': site_id
  }

  /* Setup our event handlers */
  addHandlers(state)

  /* Initial Stats */
  provide(state, getStats)()

  return PrivlyticsEnum.SUCCESS
}

export default privlytics
