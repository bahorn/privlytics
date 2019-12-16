import { PrivlyticsEnum } from './constants'
import { isDNTEnabled } from './browser'
import { randomSample } from './utils' 

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

export default conditions;
