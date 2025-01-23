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
      for (const doc of generate(schemaName, { count: COUNT })) {
        assert(validate(schemaName, valueOf(doc)), 'doc is valid')
        // This should not throw.
        encode(doc)
      }
    })
  }

  await t.test('coreOwnership', () => {
    for (const doc of generate('coreOwnership', { count: COUNT })) {
      assert(validate('coreOwnership', doc), 'doc is valid')
      // This should not throw.
      encode({
        ...doc,
        identitySignature: Buffer.alloc(32),
      })
    }
  })
})

test('passing count=0 returns an empty array', () => {
  const schemaNames = Object.keys(listSchemas())

  for (const schemaName of schemaNames) {
    assert.deepEqual(generate(schemaName, { count: 0 }), [])
  }
})
