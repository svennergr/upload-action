'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.getBackendIdsFromToken = void 0
const config_1 = require('./config')
const jwt_decode_1 = __importDefault(require('jwt-decode'))
const InvalidJwtError = new Error(
  'Failed to get backend IDs: The provided JWT token is invalid'
)
// uses the JWT token claims to get the
// workflow run and workflow job run backend ids
function getBackendIdsFromToken() {
  const token = (0, config_1.getRuntimeToken)()
  const decoded = (0, jwt_decode_1.default)(token)
  if (!decoded.scp) {
    throw InvalidJwtError
  }
  /*
   * example decoded:
   * {
   *   scp: "Actions.ExampleScope Actions.Results:ce7f54c7-61c7-4aae-887f-30da475f5f1a:ca395085-040a-526b-2ce8-bdc85f692774"
   * }
   */
  const scpParts = decoded.scp.split(' ')
  if (scpParts.length === 0) {
    throw InvalidJwtError
  }
  /*
   * example scpParts:
   * ["Actions.ExampleScope", "Actions.Results:ce7f54c7-61c7-4aae-887f-30da475f5f1a:ca395085-040a-526b-2ce8-bdc85f692774"]
   */
  for (const scopes of scpParts) {
    const scopeParts = scopes.split(':')
    /*
     * example scopeParts:
     * ["Actions.Results", "ce7f54c7-61c7-4aae-887f-30da475f5f1a", "ca395085-040a-526b-2ce8-bdc85f692774"]
     */
    if (scopeParts.length !== 3) {
      // not the Actions.Results scope
      continue
    }
    if (scopeParts[0] !== 'Actions.Results') {
      // not the Actions.Results scope
      continue
    }
    return {
      workflowRunBackendId: scopeParts[1],
      workflowJobRunBackendId: scopeParts[2]
    }
  }
  throw InvalidJwtError
}
exports.getBackendIdsFromToken = getBackendIdsFromToken
//# sourceMappingURL=util.js.map
