import { provide } from '../network'

import loadEvent from './load'
import unloadEvent from './unload'

/* Hook events like onunload so we can get page view time */
const setupEvents = (state) => {
  window.addEventListener('load',
    provide(state, loadEvent.handler, {})
  )
  window.addEventListener('unload',
    provide(state, unloadEvent.handler, unloadEvent.setup())
  )
}

export {
  setupEvents
}
