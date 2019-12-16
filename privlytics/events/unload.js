/* Leave Event */

const setup = () => {
  return {
    startDate: new Date()
  }
}

const handler = (args) => {
  const { startDate } = args;
  return {
    time: new Date() - startDate 
  }
}

export default {
  setup,
  handler
}
