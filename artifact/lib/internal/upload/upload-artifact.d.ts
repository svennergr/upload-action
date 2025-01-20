import { UploadOptions } from './upload-options'
import { UploadResponse } from './upload-response'
export declare function uploadArtifact(
  name: string,
  files: string[],
  rootDirectory: string,
  options?: UploadOptions | undefined
): Promise<UploadResponse>
