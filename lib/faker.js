import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'

/**
 * @typedef {typeof import('@mapeo/schema').docSchemas[import('@mapeo/schema/dist/types.js').SchemaName]} ValidSchema
 */

const FAKER_EXTENSIONS = /** @type {const} */ ({
  mapeo: {
    id: () =>
      faker.string.hexadecimal({ length: 64, prefix: '', casing: 'lower' }),
    links: () =>
      faker.helpers.multiple(
        () =>
          faker.string.hexadecimal({ length: 64, prefix: '', casing: 'lower' }),
        {
          count: {
            min: 0,
            max: 5,
          },
        },
      ),
    roleId: () =>
      faker.string.hexadecimal({ length: 12, prefix: '', casing: 'lower' }),
  },
})

JSONSchemaFaker.extend('faker', () => {
  return Object.assign(faker, FAKER_EXTENSIONS)
})

export { JSONSchemaFaker, createFakerSchema }

/**
 * @param {ValidSchema} schema
 */
function createFakerSchema(schema) {
  // TODO: Ideally uses structured clone but not supported in Node 16
  /** @type {import('type-fest').WritableDeep<ValidSchema>} */
  const s = JSON.parse(JSON.stringify(schema))

  mutateWithFakerProperty(s.properties.docId, 'mapeo.id')
  mutateWithFakerProperty(s.properties.versionId, 'mapeo.id')
  mutateWithFakerProperty(s.properties.links, 'mapeo.links')

  switch (s.title) {
    case 'CoreOwnership': {
      mutateWithFakerProperty(s.properties.authCoreId, 'mapeo.id')
      mutateWithFakerProperty(s.properties.blobCoreId, 'mapeo.id')
      mutateWithFakerProperty(s.properties.blobIndexCoreId, 'mapeo.id')
      mutateWithFakerProperty(s.properties.configCoreId, 'mapeo.id')
      mutateWithFakerProperty(s.properties.dataCoreId, 'mapeo.id')
      return s
    }
    case 'Device Info': {
      return s
    }
    case 'Field': {
      return s
    }
    case 'Observation': {
      mutateWithFakerProperty(
        s.definitions.position.properties.coords.properties.longitude,
        'location.longitude',
      )

      mutateWithFakerProperty(
        s.definitions.position.properties.coords.properties.latitude,
        'location.latitude',
      )

      mutateWithFakerProperty(s.properties.lon, 'location.longitude')
      mutateWithFakerProperty(s.properties.lat, 'location.latitude')

      mutateWithFakerProperty(s.properties.refs.items.properties.id, 'mapeo.id')

      return s
    }
    case 'Preset': {
      mutateWithFakerProperty(s.properties.fieldIds, 'mapeo.links')
      mutateWithFakerProperty(s.properties.iconId, 'mapeo.id')
      return s
    }
    case 'ProjectSettings': {
      return s
    }
    case 'Role': {
      mutateWithFakerProperty(s.properties.roleId, 'mapeo.roleId')
      return s
    }
    case 'Icon': {
      return s
    }
  }
}

/**
 * @template {keyof typeof FAKER_EXTENSIONS} TCustomExtensionNamespace
 * @template {keyof (typeof FAKER_EXTENSIONS)[keyof typeof FAKER_EXTENSIONS]} TCustomExtensionField
 * @template {`${TCustomExtensionNamespace}.${TCustomExtensionField}`} TCustomExtensionId
 * @template {`location.${Extract<keyof import("@faker-js/faker").LocationModule, 'latitude' | 'longitude'>}`} TLocationFakerId
 * @param {object} property
 * @param {TCustomExtensionId | TLocationFakerId} fakerId
 */
function mutateWithFakerProperty(property, fakerId) {
  // @ts-expect-error
  property.faker = fakerId
}
