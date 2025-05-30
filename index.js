import { docSchemas } from '@comapeo/schema'
import { JSONSchemaFaker, createFakerSchema } from './lib/faker.js'
import { extractSchemaVersion } from './lib/schema.js'
/** @typedef {import('@comapeo/schema/dist/types.js').SchemaName} SchemaName */

export function listSchemas() {
  /** @type {{[name: string]: Array<string>}} */
  const result = {}

  for (const [schemaName, schema] of Object.entries(docSchemas)) {
    result[schemaName] = [extractSchemaVersion(schema.$id)]
  }

  return result
}

/** @type {Map<SchemaName, ReturnType<typeof createFakerSchema>>} schemaCache */
const fakerSchemaCache = new Map()

/**
 * @param {SchemaName} schemaName
 */
function getFakerSchema(schemaName) {
  const cached = fakerSchemaCache.get(schemaName)
  if (cached) return cached
  const targetSchema = docSchemas[schemaName]
  const result = createFakerSchema(targetSchema)
  fakerSchemaCache.set(schemaName, result)
  return result
}

/**
 * @template {SchemaName} TSchemaName
 * @param {TSchemaName} schemaName
 * @param {{version?: string, count?: number}} [options]
 * @returns {Array<Extract<import('@comapeo/schema').MapeoDoc, { schemaName: TSchemaName }>>}
 */
export function generate(schemaName, { count = 1 } = {}) {
  const schema = getFakerSchema(schemaName)

  /** @type {Array<Extract<import('@comapeo/schema').MapeoDoc, { schemaName: TSchemaName }>>} */
  const result = []

  for (let i = 0; i < count; i++) {
    result.push(
      /** @type {Extract<import('@comapeo/schema').MapeoDoc, { schemaName: TSchemaName }>} */ (
        JSONSchemaFaker.generate(
          // @ts-expect-error
          schema,
        )
      ),
    )
  }

  return result
}
