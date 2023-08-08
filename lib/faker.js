import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'

/**
 * @typedef {typeof import('@mapeo/schema').docSchemas[import('@mapeo/schema/dist/types.js').SchemaName]} ValidSchema
 */

JSONSchemaFaker.extend('faker', () => {
  return Object.assign(faker, {
    mapeo: {
      id: () => faker.string.hexadecimal({ length: 64, prefix: '' }),
      links: () =>
        faker.helpers.multiple(
          () => faker.string.hexadecimal({ length: 64, prefix: '' }),
          {
            count: {
              min: 0,
              max: 5,
            },
          },
        ),
    },
  })
})

export { JSONSchemaFaker, createFakerSchema }

/**
 * @param {ValidSchema} schema
 */
function createFakerSchema(schema) {
  // Ideally uses structured clone but not supported in Node 16
  /** @type {import('type-fest').WritableDeep<ValidSchema>} */
  const s = JSON.parse(JSON.stringify(schema))

  // @ts-expect-error
  s.properties.docId.faker = 'mapeo.id'
  // @ts-expect-error
  s.properties.versionId.faker = 'mapeo.id'
  // @ts-expect-error
  s.properties.links.faker = 'mapeo.links'

  switch (s.title) {
    case 'CoreOwnership': {
      // @ts-expect-error
      s.properties.coreId.faker = 'mapeo.id'
      // @ts-expect-error
      s.properties.projectId.faker = 'mapeo.id'
      return s
    }
    case 'Device': {
      // @ts-expect-error
      s.properties.authorId.faker = 'mapeo.id'
      // @ts-expect-error
      s.properties.projectId.faker = 'mapeo.id'
      return s
    }
    case 'Field': {
      return s
    }
    case 'Observation': {
      // @ts-expect-error
      s.definitions.position.properties.coords.properties.longitude.faker =
        'location.longitude'
      // @ts-expect-error
      s.definitions.position.properties.coords.properties.latitude.faker =
        'location.latitude'
      // @ts-expect-error
      s.properties.lon.faker = 'location.longitude'
      // @ts-expect-error
      s.properties.lat.faker = 'location.latitude'
      // @ts-expect-error
      s.properties.refs.items.properties.id.faker = 'mapeo.id'

      return s
    }
    case 'Preset': {
      // @ts-expect-error
      s.properties.fieldIds.faker = 'mapeo.links'
      return s
    }
    case 'Project': {
      return s
    }
    case 'Role': {
      // @ts-expect-error
      s.properties.projectId.faker = 'mapeo.id'
      return s
    }
    default: {
      return s
    }
  }
}
