import * as core from '@actions/core'
import { create } from '../artifact/lib/artifact.js'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const artifact = create()
    const artifactName = core.getInput('name')
    const artifactPathsInput = core.getInput('paths')
    const artifactPaths = artifactPathsInput.split(',')

    const { id, size } = await artifact.uploadArtifact(
      // name of the artifact
      artifactName,
      // files to include (supports absolute and relative paths)
      artifactPaths,
      '.',
      {
        // optional: how long to retain the artifact
        // if unspecified, defaults to repository/org retention settings (the limit of this value)
        retentionDays: 10
      }
    )

    // Set outputs for other workflow steps to use
    core.setOutput('id', id)
    core.setOutput('size', size)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
