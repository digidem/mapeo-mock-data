import { encode } from '@comapeo/schema'
import test from 'node:test'
import { generate, listSchemas } from '../index.js'

test('generates encodable data', { concurrency: true }, async (t) => {
  const COUNT = 1000

  const schemaNames = Object.keys(listSchemas())

  for (const schemaName of schemaNames) {
    if (schemaName === 'coreOwnership') continue
    await t.test(schemaName, () => {
      for (const doc of generate(schemaName, { count: COUNT })) {
        // This should not throw.
        encode(doc)
      }
    })
  }

  await t.test('coreOwnership', () => {
    for (const doc of generate('coreOwnership', { count: COUNT })) {
      // This should not throw.
      encode({
        ...doc,
        identitySignature: Buffer.alloc(32),
      })
    }
  })
})
