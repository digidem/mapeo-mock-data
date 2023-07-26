# Mapeo Mock Data

Module and CLI to generate fake data for Mapeo

## Installation

_This module is not published yet, so the following instructions do not actually work yet_

```sh
npm install @mapeo/mock-data
```

## Usage

### Command line API

#### `list-mapeo-schemas`

Lists the available Mapeo schemas and the corresponding available versions for each.

```sh
npx list-mapeo-schemas
```

example output:

```json
{
  "coreOwnership": ["v1"],
  "device": ["v1"],
  "field": ["v1"],
  "filter": ["v1"],
  "observation": ["v4", "v5"],
  "preset": ["v1"],
  "project": ["v1"],
  "role": ["v1"]
}
```

#### `generate-mapeo-data`

Generates JSON-formatted Mapeo data based on [`@mapeo/schema`](https://github.com/digidem/mapeo-schema/).

- `--schema, -s`: specifies the schema to generate data for. Use the `list-mapeo-schemas` command to learn which ones are available.
- `--version, -v`: (_optional_) specifies the schema version to use for `--schema`. Uses latest version by default.
- `--count, -c`: (_optional_) specifies the number of entries to generate. Uses `1` by default.
- `--output, -o`: (_optional_) specifies a path relative to the current working directory to write the generated data to. Logs to stdout by default.

```sh
# Generate data for the specified schema
npx generate-mapeo-data --schema observation

# Generate 10 entries of data
npx generate-mapeo-data --schema observation --count 10

# Generate data using a specific schema version
npx generate-mapeo-data --schema observation --version v4

# Generate data and write to the specified output file
npx generate-mapeo-data --schema observation --output observations.json
```

### Programmatic API

#### `mapeoMockData.generate`

`(schemaName: string, opts?: { version?: string, count?: number }) => Array<SchemaData>`

Returns mocked data for the specified `schemaName`, where `SchemaData` adheres to the schema definition associated with `schemaName`. Accepts the following `opts`:

- `version`: specify the schema version to use
- `count`: specify the number of records to generate

#### `mapeoMockData.listSchemas`

`() => { [name: string]: Array<string> }`

Returns the available schemas to generate from and the corresponding versions that are available for each. Example value may look like this:

```js
{
  coreOwnership: ["v1"],
  device: ["v1"],
  field: ["v1"],
  filter: ["v1"],
  observation: ["v4", "v5"],
  preset: ["v1"],
  project: ["v1"],
  role: ["v1"]
}
```
