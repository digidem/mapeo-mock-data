import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'
import deref from 'dereference-json-schema'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const Geometry = require('@comapeo/geometry/json/geometry.json')

/**
 * @typedef {typeof import('@comapeo/schema').docSchemas[import('@comapeo/schema/dist/types.js').SchemaName]} ValidSchema
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
  // Helpful references:
  // - https://exiftool.org/TagNames/EXIF.html
  // - https://www.media.mit.edu/pia/Research/deepview/exif.html
  exif: {
    // Local YYYY:MM:DD HH:MM:SS (i.e. should NOT be converted to UTC)
    dateTime: () => {
      const d = new Date(faker.date.past({ years: 1, refDate: Date.now() }))

      const year = `${d.getFullYear()}`
      const month = `${d.getMonth()}`.padStart(2, '0')
      const date = `${d.getDate()}`.padStart(2, '0')

      const hour = `${d.getHours()}`.padStart(2, '0')
      const minutes = `${d.getMinutes()}`.padStart(2, '0')
      const seconds = `${d.getSeconds()}`.padStart(2, '0')

      return `${year}:${month}:${date} ${hour}:${minutes}:${seconds}`
    },
    // Helpful references
    // - https://exiftool.org/TagNames/GPS.html
    // - https://www.opanda.com/en/pe/help/gps.html#GPSTimeStamp
    gps: {
      // UTC-adjusted YYYY:MM:DD
      dateStamp: () => {
        const d = new Date(faker.date.past({ years: 1, refDate: Date.now() }))

        const year = `${d.getUTCFullYear()}`
        const month = `${d.getUTCMonth() + 1}`.padStart(2, '0')
        const date = `${d.getUTCDate()}`.padStart(2, '0')

        return `${year}:${month}:${date}`
      },
      // UTC-adjusted HH:MM:SS
      timeStamp: () => {
        const d = new Date(faker.date.past({ years: 1, refDate: Date.now() }))

        const hour = `${d.getUTCHours()}`.padStart(2, '0')
        const minutes = `${d.getUTCMinutes()}`.padStart(2, '0')
        const seconds = `${d.getUTCSeconds()}`

        return `${hour}:${minutes}:${seconds}`
      },
    },
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
      mutateWithFakerProperty(
        s.properties.selfHostedServerDetails.properties.baseUrl,
        'internet.url',
      )
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

      // Attachments
      for (const attachmentDef of s.definitions.attachment.oneOf) {
        mutateWithFakerProperty(
          attachmentDef.properties.driveDiscoveryId,
          'mapeo.id',
        )
        mutateWithFakerProperty(attachmentDef.properties.hash, 'mapeo.id')
        mutateWithFakerProperty(attachmentDef.properties.name, 'mapeo.id8')
        mutateWithFakerProperty(
          attachmentDef.properties.driveDiscoveryId,
          'mapeo.id',
        )
        mutateWithFakerProperty(attachmentDef.properties.hash, 'mapeo.id')
        mutateWithFakerProperty(attachmentDef.properties.name, 'mapeo.id8')

        // TODO: Can fake more of the fields
        if ('photoExif' in attachmentDef.properties) {
          mutateWithFakerProperty(
            attachmentDef.properties.photoExif.properties.DateTime,
            'exif.dateTime',
          )

          mutateWithFakerProperty(
            attachmentDef.properties.photoExif.properties.GPSLatitude,
            'location.latitude',
          )
          mutateWithFakerProperty(
            attachmentDef.properties.photoExif.properties.GPSLongitude,
            'location.longitude',
          )
          mutateWithFakerProperty(
            attachmentDef.properties.photoExif.properties.GPSTimeStamp,
            'exif.gps.timeStamp',
          )
          mutateWithFakerProperty(
            attachmentDef.properties.photoExif.properties.GPSDateStamp,
            'exif.gps.dateStamp',
          )
        }
      }

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
      mutateWithFakerProperty(s.definitions.blobVersionId, 'mapeo.versionId')
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
    case 'RemoteDetectionAlert':
      // @ts-expect-error Dereferencing this causes a type error, but the data
      // is generated correctly.
      s.properties.geometry = deref.dereferenceSync(Geometry)
      return s
  }
}

/**
 * Derives a union of all keys of an object, including nested objects. Each level of nesting is separated with a period (`.`).
 * https://alexop.dev/posts/typescript-extract-all-keys-nested-objects/
 *
 * @template T
 * @typedef {T extends object ? { [K in keyof T & string]: | K | (T[K] extends object ? `${K}.${ExtractKeys<T[K]>}` : never) }[keyof T & string] : never} ExtractKeys
 */

/**
 * Derives valid Faker IDs that can be used with `json-schema-faker`.
 *
 * @template T
 * @typedef {Extract<ExtractKeys<T>, `${string}.${string}`>} FakerId
 */

/**
 * @param {object} property
 * @param {FakerId<typeof FAKER_EXTENSIONS> | FakerId<import("@faker-js/faker").Faker>} fakerId
 */
function mutateWithFakerProperty(property, fakerId) {
  // @ts-expect-error
  property.faker = fakerId
}
