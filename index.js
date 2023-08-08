import { docSchemas } from '@mapeo/schema'
import { JSONSchemaFaker, createFakerSchema } from './lib/faker.js'
import { extractSchemaVersion, isValidSchemaName } from './lib/schema.js'

export function listSchemas() {
  /** @type {{[name: string]: Array<string>}} */
  const result = {}

  for (const [schemaName, schema] of Object.entries(docSchemas)) {
    result[schemaName] = [extractSchemaVersion(schema.$id)]
  }

  return result
}

/**
 * @param {import('@mapeo/schema/dist/types.js').SchemaName} schemaName
 * @param {{version?: string, count?: number}} [options]
 * @returns {Promise<Array<import('@mapeo/schema').MapeoDoc>>}
 */
export async function generate(schemaName, { count } = {}) {
  isValidSchemaName(schemaName)

  const targetSchema = docSchemas[schemaName]
  const numberToGenerate = count || 1

  /** @type {Array<import('@mapeo/schema').MapeoDoc>} */
  const result = []

  for (let i = 0; i < numberToGenerate; i++) {
    result.push(
      /** @type {import('@mapeo/schema').MapeoDoc} */ (
        await JSONSchemaFaker.resolve(createFakerSchema(targetSchema))
      ),
    )
  }

  return result
}
