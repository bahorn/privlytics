import UAParser from 'ua-parser-js'

/* Leave Event */

const setup = () => {
  return {
    startDate: new Date()
  }
}

const handler = (args) => {
  const { browser } = new UAParser().getResult()
  const host = new URL(document.referrer || 'https://example.com/').hostname
  const { startDate } = args;
  console.log('CALLEd')
  return {
    time: new Date() - startDate,
    'host': host,
    'browser': {
      'version': browser['major'] || null,
      'name': browser['name'] || null
    }
  }
}

export default {
  setup,
  handler
}
