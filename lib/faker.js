import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'
import { pipe, setPath } from 'remeda'

JSONSchemaFaker.extend('faker', () => {
  return Object.assign(faker, {
    mapeo: {
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
    },
  })
})

export { JSONSchemaFaker, createFakerSchema }

/**
 * @param {unknown} schema
 */
function createFakerSchema(schema) {
  if (typeof schema !== 'object' || !schema)
    throw new Error('schema must be object type')
  if (!('title' in schema)) throw new Error('Missing `title` field')

  switch (schema.title) {
    case 'Common': {
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'id', 'faker'], 'mapeo.id'),
        setPath(['properties', 'version', 'faker'], 'mapeo.id'),
        setPath(['properties', 'userId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'deviceId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'links', 'faker'], 'mapeo.links'),
      )
    }
    case 'CoreOwnership': {
      // TODO: update signature, authorIndex, and deviceIndex
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'coreId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'projectId', 'faker'], 'mapeo.id'),
      )
    }
    case 'Device': {
      // TODO: update signature, authorIndex, and deviceIndex
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'coreId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'projectId', 'faker'], 'mapeo.id'),
      )
    }
    case 'Field': {
      return schema
    }
    case 'Filter': {
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'id', 'faker'], 'mapeo.id'),
        setPath(['properties', 'version', 'faker'], 'mapeo.id'),
        setPath(['properties', 'userId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'deviceId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'links', 'faker'], 'mapeo.links'),
      )
    }
    case 'Observation': {
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'lon', 'faker'], 'location.longitude'),
        setPath(['properties', 'lat', 'faker'], 'location.latitude'),
        setPath(
          [
            'definitions',
            'position',
            'properties',
            'coords',
            'properties',
            'longitude',
            'faker',
          ],
          'location.longitude',
        ),
        setPath(
          [
            'definitions',
            'position',
            'properties',
            'coords',
            'properties',
            'latitude',
            'faker',
          ],
          'location.latitude',
        ),
        setPath(
          ['properties', 'refs', 'items', 'properties', 'id', 'faker'],
          'mapeo.id',
        ),
      )
    }
    case 'Preset': {
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'fields', 'faker'], 'mapeo.links'),
      )
    }
    case 'Project': {
      return schema
    }
    case 'Role': {
      // TODO: update signature, authorIndex, and deviceIndex
      return pipe(
        /** @type {any} */ (schema),
        setPath(['properties', 'projectId', 'faker'], 'mapeo.id'),
      )
    }
    default: {
      return schema
    }
  }
}
