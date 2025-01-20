'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            }
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.uploadArtifact = void 0
const core = __importStar(require('@actions/core'))
const retention_1 = require('./retention')
const path_and_artifact_name_validation_1 = require('./path-and-artifact-name-validation')
const artifact_twirp_client_1 = require('../shared/artifact-twirp-client')
const upload_zip_specification_1 = require('./upload-zip-specification')
const util_1 = require('../shared/util')
function uploadArtifact(name, files, rootDirectory, options) {
  return __awaiter(this, void 0, void 0, function* () {
    ;(0, path_and_artifact_name_validation_1.validateArtifactName)(name)
    ;(0, upload_zip_specification_1.validateRootDirectory)(rootDirectory)
    const zipSpecification = (0,
    upload_zip_specification_1.getUploadZipSpecification)(files, rootDirectory)
    if (zipSpecification.length === 0) {
      core.warning(`No files were found to upload`)
      return {
        success: false
      }
    }
    // get the IDs needed for the artifact creation
    const backendIds = (0, util_1.getBackendIdsFromToken)()
    if (
      !backendIds.workflowRunBackendId ||
      !backendIds.workflowJobRunBackendId
    ) {
      core.warning(`Failed to get backend ids`)
      return {
        success: false
      }
    }
    core.debug(`Workflow Run Backend ID: ${backendIds.workflowRunBackendId}`)
    core.debug(
      `Workflow Job Run Backend ID: ${backendIds.workflowJobRunBackendId}`
    )
    // create the artifact client
    const artifactClient = (0,
    artifact_twirp_client_1.createArtifactTwirpClient)('upload')
    // create the artifact
    const createArtifactReq = {
      workflowRunBackendId: backendIds.workflowRunBackendId,
      workflowJobRunBackendId: backendIds.workflowJobRunBackendId,
      name,
      version: 4
    }
    // if there is a retention period, add it to the request
    const expiresAt = (0, retention_1.getExpiration)(
      options === null || options === void 0 ? void 0 : options.retentionDays
    )
    if (expiresAt) {
      createArtifactReq.expiresAt = expiresAt
    }
    const createArtifactResp =
      yield artifactClient.CreateArtifact(createArtifactReq)
    if (!createArtifactResp.ok) {
      core.warning(`Failed to create artifact`)
      return {
        success: false
      }
    }
    // TODO - Implement upload functionality
    // finalize the artifact
    const finalizeArtifactResp = yield artifactClient.FinalizeArtifact({
      workflowRunBackendId: backendIds.workflowRunBackendId,
      workflowJobRunBackendId: backendIds.workflowJobRunBackendId,
      name,
      size: '0' // TODO - Add size
    })
    if (!finalizeArtifactResp.ok) {
      core.warning(`Failed to finalize artifact`)
      return {
        success: false
      }
    }
    const uploadResponse = {
      success: true,
      size: 0,
      id: parseInt(finalizeArtifactResp.artifactId) // TODO - will this be a problem due to the id being a bigint?
    }
    return uploadResponse
  })
}
exports.uploadArtifact = uploadArtifact
//# sourceMappingURL=upload-artifact.js.map
