import { PrivlyticsEnum } from './constants'
import { isDNTEnabled  } from './browser'
import { randomSample, uuidv4 } from './utils'
import { setupEvents } from './events'

/* What we check before we try to do analytics */
const conditions = (site_id, sample_size) => {
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

  return PrivlyticsEnum.SUCCESS
}

const setup = (site_id, endpoint) => {

  /* We pass this down our tree of events. All these values are static and
   * defined here */
  const state = {
    'uuid': uuidv4(),
    'endpoint': endpoint,
    'site_id': site_id
  }

  /* Setup our event handlers */
  setupEvents(state)

}

const privlytics = (site_id, endpoint, sample_size=0.1) => {
  const condition = conditions(site_id, sample_size);
  if (condition != PrivlyticsEnum.SUCCESS) {
    return condition
  }

  setup(site_id, endpoint)

  return PrivlyticsEnum.SUCCESS
}

export default privlytics
