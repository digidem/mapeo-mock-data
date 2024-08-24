import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'

/**
 * @typedef {typeof import('@mapeo/schema').docSchemas[import('@mapeo/schema/dist/types.js').SchemaName]} ValidSchema
 */

/**
 * @param {number} bytes
 */
function hexString(bytes) {
  return faker.string.hexadecimal({
    length: bytes * 2,
    prefix: '',
    casing: 'lower',
  })
}

function versionId() {
  return hexString(32) + '/' + faker.number.int(1000)
}

const FAKER_EXTENSIONS = /** @type {const} */ ({
  mapeo: {
    id: () => hexString(32),
    versionId: () => versionId(),
    links: () =>
      faker.helpers.multiple(() => versionId(), {
        count: {
          min: 0,
          max: 5,
        },
      }),
    id8: () => hexString(8),
    comver: () =>
      `${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`,
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
  mutateWithFakerProperty(s.properties.versionId, 'mapeo.versionId')
  mutateWithFakerProperty(s.properties.originalVersionId, 'mapeo.versionId')
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
    case 'DeviceInfo': {
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

      mutateWithFakerProperty(
        s.properties.attachments.items.properties.driveDiscoveryId,
        'mapeo.id',
      )
      mutateWithFakerProperty(
        s.properties.attachments.items.properties.hash,
        'mapeo.id',
      )
      mutateWithFakerProperty(
        s.properties.attachments.items.properties.name,
        'mapeo.id8',
      )

      mutateWithFakerProperty(
        s.properties.presetRef.properties.docId,
        'mapeo.id',
      )

      mutateWithFakerProperty(
        s.properties.presetRef.properties.versionId,
        'mapeo.versionId',
      )

      return s
    }
    case 'Preset': {
      mutateWithFakerProperty(
        s.properties.fieldRefs.items.properties.docId,
        'mapeo.id',
      )
      mutateWithFakerProperty(
        s.properties.fieldRefs.items.properties.versionId,
        'mapeo.versionId',
      )

      mutateWithFakerProperty(s.properties.iconRef.properties.docId, 'mapeo.id')
      mutateWithFakerProperty(
        s.properties.iconRef.properties.versionId,
        'mapeo.versionId',
      )
      return s
    }
    case 'ProjectSettings': {
      mutateWithFakerProperty(
        s.properties.configMetadata.properties.fileVersion,
        'mapeo.comver',
      )
      return s
    }
    case 'Role': {
      mutateWithFakerProperty(s.properties.roleId, 'mapeo.id8')
      return s
    }
    case 'Icon': {
      s.properties.variants.items.oneOf.forEach((variant) =>
        mutateWithFakerProperty(
          variant.properties.blobVersionId,
          'mapeo.versionId',
        ),
      )
      return s
    }
    case 'Track': {
      mutateWithFakerProperty(
        s.properties.observationRefs.items.properties.docId,
        'mapeo.id',
      )
      mutateWithFakerProperty(
        s.properties.observationRefs.items.properties.versionId,
        'mapeo.versionId',
      )
      return s
    }
    case 'translation': {
      mutateWithFakerProperty(s.properties.docRef.properties.docId, 'mapeo.id')
      mutateWithFakerProperty(
        s.properties.docRef.properties.versionId,
        'mapeo.versionId',
      )

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
