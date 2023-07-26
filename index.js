import path from 'node:path'
import fs from 'node:fs'

import { JSONSchemaFaker, createFakerSchema } from './lib/faker.js'
import {
  readSchemas,
  getMapeoSchemaPaths,
  getSchemaInfo,
} from './lib/schema.js'

export function listSchemas() {
  /** @type {{[name: string]: Array<string>}} */
  const result = {}

  for (const schema of getMapeoSchemaPaths().schemas) {
    // We skip `common` schema
    if (schema.name === 'common') continue
    const schemaVersions = fs.readdirSync(schema.filePath)

    result[schema.name] = schemaVersions.map((v) => path.parse(v).name)
  }

  return result
}

/**
 * @param {string} schemaName
 * @param {{version?: string, count?: number}} [options]
 * @returns {Promise<Array<import('type-fest').JsonValue>>}
 */
export async function generate(schemaName, { version, count } = {}) {
  const mapeoSchemaPaths = getMapeoSchemaPaths()

  const schemas = readSchemas(mapeoSchemaPaths.schemas)

  const commonSchemaInfo = getSchemaInfo(schemas, 'common')
  const targetSchemaInfo = getSchemaInfo(schemas, schemaName, version)

  const numberToGenerate = count || 1

  const result = Array(numberToGenerate)

  for (let i = 0; i < numberToGenerate; i++) {
    result[i] = await JSONSchemaFaker.resolve(
      createFakerSchema(targetSchemaInfo.schema),
      {
        [commonSchemaInfo.filePath]: createFakerSchema(commonSchemaInfo.schema),
      },
      path.join(mapeoSchemaPaths.base, schemaName),
    )
  }

  return result
}
