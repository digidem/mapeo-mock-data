import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'
import { pipe, setPath } from 'remeda'

export function initializeJsf() {
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

  return JSONSchemaFaker
}

/**
 * @param {*} schema
 */
export function createFakerSchema(schema) {
  const { title } = schema

  if (!title) throw new Error('Missing `title` field')

  switch (title) {
    case 'Common': {
      return pipe(
        schema,
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
        schema,
        setPath(['properties', 'coreId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'projectId', 'faker'], 'mapeo.id'),
      )
    }
    case 'Device': {
      // TODO: update signature, authorIndex, and deviceIndex
      return pipe(
        schema,
        setPath(['properties', 'coreId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'projectId', 'faker'], 'mapeo.id'),
      )
    }
    case 'Field': {
      return schema
    }
    case 'Filter': {
      return pipe(
        schema,
        setPath(['properties', 'id', 'faker'], 'mapeo.id'),
        setPath(['properties', 'version', 'faker'], 'mapeo.id'),
        setPath(['properties', 'userId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'deviceId', 'faker'], 'mapeo.id'),
        setPath(['properties', 'links', 'faker'], 'mapeo.links'),
      )
    }
    case 'Observation': {
      return pipe(
        schema,
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
        schema,
        setPath(['properties', 'fields', 'faker'], 'mapeo.links'),
      )
    }
    case 'Project': {
      return schema
    }
    case 'Role': {
      // TODO: update signature, authorIndex, and deviceIndex
      return pipe(
        schema,
        setPath(['properties', 'projectId', 'faker'], 'mapeo.id'),
      )
    }
    default: {
      return schema
    }
  }
}
