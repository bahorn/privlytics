import UAParser from 'ua-parser-js'

/* Get what we care about from the users browsers during the initial load */
const handler = () => {
  const { browser } = new UAParser().getResult()
  return {
    'host': new URL(document.referrer).hostname,
    'browser': {
      'version': browser['major'] || null,
      'name': browser['name'] || null
    }
  }
}

export default {
  handler
}
