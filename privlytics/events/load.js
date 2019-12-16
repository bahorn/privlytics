import UAParser from 'ua-parser-js'

/* Get what we care about from the users browsers during the initial load */
const handler = () => {
  const { browser } = new UAParser().getResult()
  const host = new URL(document.referrer || 'https://example.com/').hostname
  return {
    'host': host,
    'browser': {
      'version': browser['major'] || null,
      'name': browser['name'] || null
    }
  }
}

export default {
  handler
}
