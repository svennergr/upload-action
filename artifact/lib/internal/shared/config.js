'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.isGhes = exports.getResultsServiceUrl = exports.getRuntimeToken = void 0
function getRuntimeToken() {
  const token = process.env['ACTIONS_RUNTIME_TOKEN']
  if (!token) {
    throw new Error('Unable to get the ACTIONS_RUNTIME_TOKEN env variable')
  }
  return token
}
exports.getRuntimeToken = getRuntimeToken
function getResultsServiceUrl() {
  const resultsUrl = process.env['ACTIONS_RESULTS_URL']
  if (!resultsUrl) {
    throw new Error('Unable to get the ACTIONS_RESULTS_URL env variable')
  }
  return resultsUrl
}
exports.getResultsServiceUrl = getResultsServiceUrl
function isGhes() {
  const ghUrl = new URL(
    process.env['GITHUB_SERVER_URL'] || 'https://github.com'
  )
  return ghUrl.hostname.toUpperCase() !== 'GITHUB.COM'
}
exports.isGhes = isGhes
//# sourceMappingURL=config.js.map
