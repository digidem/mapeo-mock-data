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
 * @template {import('@mapeo/schema/dist/types.js').SchemaName} TSchemaName
 * @param {TSchemaName} schemaName
 * @param {{version?: string, count?: number}} [options]
 * @returns {Array<Extract<import('@mapeo/schema').MapeoDoc, { schemaName: TSchemaName }>>}
 */
export function generate(schemaName, { count } = {}) {
  isValidSchemaName(schemaName)

  const targetSchema = docSchemas[schemaName]
  const numberToGenerate = count || 1

  /** @type {Array<Extract<import('@mapeo/schema').MapeoDoc, { schemaName: TSchemaName }>>} */
  const result = []

  for (let i = 0; i < numberToGenerate; i++) {
    result.push(
      /** @type {Extract<import('@mapeo/schema').MapeoDoc, { schemaName: TSchemaName }>} */ (
        JSONSchemaFaker.generate(createFakerSchema(targetSchema))
      ),
    )
  }

  return result
}
