import { PrivlyticsEnum } from './constants'
import { uuidv4 } from './utils'
import { setupEvents } from './events'
import Conditions from './conditions'

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
  const condition = Conditions(site_id, sample_size);
  if (condition != PrivlyticsEnum.SUCCESS) {
    return condition
  }

  setup(site_id, endpoint)

  return PrivlyticsEnum.SUCCESS
}

export default privlytics
