import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'

export function initializeJsf() {
  JSONSchemaFaker.extend('faker', () => {
    // @ts-expect-error
    faker.mapeo = {
      id: () => faker.string.hexadecimal({ length: 32, prefix: '' }),
      links: () =>
        faker.helpers.multiple(
          () => faker.string.hexadecimal({ length: 32, prefix: '' }),
          {
            count: {
              min: 0,
              max: 5,
            },
          },
        ),
    }

    return faker
  })

  return JSONSchemaFaker
}

/** @type {Array<[string, string]>} */
const COMMON_TRANSFORMS = [
  ['id', 'mapeo.id'],
  ['version', 'mapeo.id'],
  ['userId', 'mapeo.id'],
  ['deviceId', 'mapeo.id'],
  ['links', 'mapeo.links'],
]

/**
 * @param {*} schema
 */
export function createFakerSchema(schema) {
  const { title } = schema

  if (!title) throw new Error('Missing `title` field')

  switch (title) {
    case 'Common': {
      return createSchemaWithTransforms(schema, COMMON_TRANSFORMS)
    }
    case 'CoreOwnership': {
      // TODO: update signature, authorIndex, and deviceIndex
      return createSchemaWithTransforms(schema, [
        ['coreId', 'mapeo.id'],
        ['projectId', 'mapeo.id'],
      ])
    }
    case 'Device': {
      // TODO: update signature, authorIndex, and deviceIndex
      return createSchemaWithTransforms(schema, [
        ['coreId', 'mapeo.id'],
        ['projectId', 'mapeo.id'],
      ])
    }
    case 'Field': {
      return schema
    }
    case 'Filter': {
      return createSchemaWithTransforms(schema, COMMON_TRANSFORMS)
    }
    case 'Observation': {
      const s = createSchemaWithTransforms(schema, [
        ...COMMON_TRANSFORMS,
        ['lon', 'location.longitude'],
        ['lat', 'location.latitude'],
      ])

      // Update relevant fields in `Position` definition
      s.definitions.position.properties.coords.properties.longitude.faker =
        'location.longitude'
      s.definitions.position.properties.coords.properties.latitude.faker =
        'location.latitude'

      // TODO: Update `refs` manually

      return s
    }
    case 'Preset': {
      return createSchemaWithTransforms(schema, [['fields', 'mapeo.links']])
    }
    case 'Project': {
      return schema
    }
    case 'Role': {
      // TODO: update signature, authorIndex, and deviceIndex
      return createSchemaWithTransforms(schema, [['projectId', 'mapeo.id']])
    }
    default: {
      return schema
    }
  }
}

/**
 * @param {*} schema
 * @param {Array<[string, string]>} transforms An list of tuples describing the transforms to apply on the `properties` field ([property, fakerMock])
 */
function createSchemaWithTransforms(schema, transforms) {
  // Ideally use structured clone I guess, but good enough
  const extendedSchema = JSON.parse(JSON.stringify(schema))

  for (const [property, fakerType] of transforms) {
    // Silently ignore properties that don't already exist in the schema.properties
    if (!(property in extendedSchema.properties)) continue
    extendedSchema.properties[property]['faker'] = fakerType
  }

  return extendedSchema
}
