import path from 'node:path'
import fs from 'node:fs'

/**
 * @typedef {Object} SchemaInfo
 * @property {string} version
 * @property {string} filePath
 * @property {unknown} schema
 */

/**
 * @param {Array<{name: string, filePath: string}>} info
 */
export function readSchemas(info) {
  /** @type {Map<string, Array<SchemaInfo>>} */
  const nameToSchema = new Map()

  for (const { name: schemaName, filePath: schemaDirectoryPath } of info) {
    const schemaVersions = fs.readdirSync(schemaDirectoryPath)

    /** @type {Array<SchemaInfo>} */
    const schemaInfo = []

    for (let i = 0; i < schemaVersions.length; i++) {
      const versionWithExtension = schemaVersions[i]
      const version = path.parse(versionWithExtension).name
      const schemaPath = path.join(schemaDirectoryPath, versionWithExtension)

      schemaInfo.push({
        version,
        filePath: schemaPath,
        schema: JSON.parse(fs.readFileSync(schemaPath, 'utf-8')),
      })
    }

    nameToSchema.set(schemaName, schemaInfo)
  }

  return nameToSchema
}

/**
 * @param {Map<string, Array<SchemaInfo>>} schemas
 * @param {string} name
 * @param {string} [version]
 * @returns {SchemaInfo}
 */
export function getSchemaInfo(schemas, name, version) {
  const schemasList = schemas.get(name)

  if (!schemasList) throw new Error(`Could not find schema ${name}`)

  // Assumes last one is latest
  if (!version) return schemasList[schemasList.length - 1]

  const result = schemasList.find((s) => s.version === version)

  if (!result) throw new Error(`Could not find version ${version}`)

  return result
}

/**
 * @returns {{base: string, schemas: Array<{name: string, filePath: string}>}}
 */
export function getMapeoSchemaPaths() {
  const basePath = new URL(
    '../node_modules/@mapeo/schema/schema',
    import.meta.url,
  ).pathname

  const schemaDirNames = fs.readdirSync(basePath)

  return {
    base: basePath,
    schemas: schemaDirNames.map((name) => ({
      name,
      filePath: path.join(basePath, name),
    })),
  }
}
