import path from 'node:path'
import fs from 'node:fs'
import { faker } from '@faker-js/faker'
import { JSONSchemaFaker } from 'json-schema-faker'

/**
 * @typedef {ReturnType<import('json-schema-faker').JSONSchemaFakerDefine>} JsonValue
 * @typedef {{version: string, path: string, schema: any}} SchemaInfo
 * @typedef {Array<SchemaInfo>} SchemaInfoList
 */

export function listSchemas() {
  /** @type {{[name: string]: Array<string>}} */
  const result = {}

  for (const schema of getMapeoSchemaPaths().schemas) {
    // We skip `common` schema
    if (schema.name === 'common') continue
    const schemaVersions = fs.readdirSync(schema.path)

    result[schema.name] = schemaVersions.map((v) => path.parse(v).name)
  }

  return result
}

/**
 * @param {string} schemaName
 * @param {{version?: string, count?: number}} [options]
 * @returns {Promise<Array<JsonValue>>}
 */
export async function generate(schemaName, { version, count } = {}) {
  const mapeoSchemaPaths = getMapeoSchemaPaths()

  const schemas = readSchemas(mapeoSchemaPaths.schemas)

  const commonSchemaInfo = getSchemaInfo(schemas, 'common')
  const targetSchemaInfo = getSchemaInfo(schemas, schemaName, version)

  const numberToGenerate = count || 1

  /** @type {Array<JsonValue>} */
  const result = Array(numberToGenerate)

  JSONSchemaFaker.extend('faker', () => faker)

  for (let i = 0; i < numberToGenerate; i++) {
    // TODO: Need to specify Faker formats to generate appropriate values and respect enums
    result[i] = await JSONSchemaFaker.resolve(
      targetSchemaInfo.schema,
      { [commonSchemaInfo.path]: commonSchemaInfo.schema },
      path.join(mapeoSchemaPaths.base, schemaName),
    )
  }

  return result
}

/**
 * @param {Array<{name: string, path: string}>} info
 */
function readSchemas(info) {
  const nameToSchema = new Map()

  for (const { name: schemaName, path: schemaDirectoryPath } of info) {
    const schemaVersions = fs.readdirSync(schemaDirectoryPath)

    /** @type {SchemaInfoList} */
    const schemaInfo = []

    for (let i = 0; i < schemaVersions.length; i++) {
      const versionWithExtension = schemaVersions[i]
      const version = path.parse(versionWithExtension).name
      const schemaPath = path.join(schemaDirectoryPath, versionWithExtension)

      schemaInfo.push({
        version,
        path: schemaPath,
        schema: JSON.parse(fs.readFileSync(schemaPath, 'utf-8')),
      })
    }

    nameToSchema.set(schemaName, schemaInfo)
  }

  return nameToSchema
}

/**
 * @param {Map<string, SchemaInfoList>} schemas
 * @param {string} name
 * @param {string} [version]
 * @returns {SchemaInfo}
 */
function getSchemaInfo(schemas, name, version) {
  const schemasList = schemas.get(name)

  if (!schemasList) throw new Error(`Could not find schema ${name}`)

  // Assumes last one is latest
  if (!version) return schemasList[schemasList.length - 1]

  const result = schemasList.find((s) => s.version === version)

  if (!result) throw new Error(`Could not find version ${version}`)

  return result
}

function getMapeoSchemaPaths() {
  const basePath = new URL(
    './node_modules/@mapeo/schema/schema',
    import.meta.url,
  ).pathname

  const schemaDirNames = fs.readdirSync(basePath)

  return {
    base: basePath,
    schemas: schemaDirNames.map((name) => ({
      name,
      path: path.join(basePath, name),
    })),
  }
}
