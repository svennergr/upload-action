'use strict'
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
exports.Client = void 0
const upload_artifact_1 = require('./upload/upload-artifact')
const core_1 = require('@actions/core')
const config_1 = require('./shared/config')
class Client {
  /**
   * Constructs a Client
   */
  static create() {
    return new Client()
  }
  /**
   * Uploads an artifact
   */
  uploadArtifact(name, files, rootDirectory, options) {
    return __awaiter(this, void 0, void 0, function* () {
      if ((0, config_1.isGhes)()) {
        ;(0, core_1.warning)(
          `@actions/artifact v2 and upload-artifact v4 are not currently supported on GHES.`
        )
        return {
          success: false
        }
      }
      try {
        return (0, upload_artifact_1.uploadArtifact)(
          name,
          files,
          rootDirectory,
          options
        )
      } catch (error) {
        ;(0, core_1.warning)(`Artifact upload failed with error: ${error}.

Errors can be temporary, so please try again and optionally run the action with debug enabled for more information.

If the error persists, please check whether Actions is running normally at [https://githubstatus.com](https://www.githubstatus.com).`)
        return {
          success: false
        }
      }
    })
  }
}
exports.Client = Client
//# sourceMappingURL=client.js.map
