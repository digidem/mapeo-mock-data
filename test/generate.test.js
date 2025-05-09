import { encode, validate, valueOf } from '@comapeo/schema'
import assert from 'node:assert/strict'
import test from 'node:test'
import { generate, listSchemas } from '../index.js'

test('generates valid data', { concurrency: true }, async (t) => {
  const COUNT = 1000

  const schemaNames = Object.keys(listSchemas())

  for (const schemaName of schemaNames) {
    if (schemaName === 'coreOwnership') continue
    await t.test(schemaName, () => {
      for (const doc of generate(
        // @ts-expect-error
        schemaName,
        { count: COUNT },
      )) {
        assert(
          validate(
            // @ts-expect-error
            schemaName,
            valueOf(doc),
          ),
          'doc is valid',
        )
        // This should not throw.
        encode(
          // @ts-expect-error
          doc,
        )
      }
    })
  }

  await t.test('coreOwnership', () => {
    for (const doc of generate('coreOwnership', { count: COUNT })) {
      assert(validate('coreOwnership', doc), 'doc is valid')
      // This should not throw.
      encode({
        ...doc,
        coreSignatures: {
          auth: Buffer.alloc(32),
          blob: Buffer.alloc(32),
          blobIndex: Buffer.alloc(32),
          config: Buffer.alloc(32),
          data: Buffer.alloc(32),
        },
        identitySignature: Buffer.alloc(32),
      })
    }
  })
})

test('passing count=0 returns an empty array', () => {
  const schemaNames = Object.keys(listSchemas())

  for (const schemaName of schemaNames) {
    assert.deepEqual(
      generate(
        // @ts-expect-error
        schemaName,
        { count: 0 },
      ),
      [],
    )
  }
})

test('defaults to count=1', () => {
  const schemaNames = Object.keys(listSchemas())

  for (const schemaName of schemaNames) {
    assert.equal(
      generate(
        // @ts-expect-error
        schemaName,
      ).length,
      1,
    )
  }
})
