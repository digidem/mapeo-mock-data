import { docSchemas } from '@comapeo/schema'

/**
 * @param {string} jsonSchemaId
 * @returns {string}
 */
export function extractSchemaVersion(jsonSchemaId) {
  const s = jsonSchemaId.split('/')
  return s[s.length - 1].replace('.json', '')
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
