import { docSchemas } from '@comapeo/schema'

/**
 * @param {string} jsonSchemaId
 * @returns {string}
 */
export function extractSchemaVersion(jsonSchemaId) {
  const result = jsonSchemaId.split('/').at(-1)?.replace('.json', '')

  if (!result) {
    throw new Error('Unable to extract schema version')
  }

  return result
}

/**
 *
 * @param {string} name
 *
 * @return {asserts name is import('@comapeo/schema/dist/types.js').SchemaName}
 */
export function isValidSchemaName(name) {
  if (!(name in docSchemas)) {
    throw new Error(`Could not find schema ${name}`)
  }
}
