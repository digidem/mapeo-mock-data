#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { generate } from '../index.js'

const { values } = parseArgs({
  strict: true,
  options: {
    schema: {
      type: 'string',
      short: 's',
    },
    count: {
      type: 'string',
      short: 'c',
    },
    output: {
      type: 'string',
      short: 'o',
    },
    version: {
      type: 'string',
      short: 'v',
    },
  },
})

// Args validation
if (values.schema === undefined) throw new Error('--schema must be specified')
if (typeof values.schema !== 'string')
  throw new Error('--schemas must be a string')
if (values.count !== undefined && typeof values.count !== 'string')
  throw new Error('--count must be specified')
if (values.output !== undefined && typeof values.output !== 'string')
  throw new Error('--output must be specified')
if (values.version !== undefined && typeof values.version !== 'string')
  throw new Error('--version must be specified')

// TODO: Ideally validate the parsed int
const count = values.count ? Number.parseInt(values.count, 10) : 1

const data = generate(values.schema, { count, version: values.version })

if (values.output) {
  const outputPath = path.resolve(process.cwd(), values.output)
  fs.writeFileSync(outputPath, JSON.stringify(data))
  console.log(`Wrote data to ${outputPath}`)
  process.exit(0)
}

console.log(JSON.stringify(data, null, 2))
