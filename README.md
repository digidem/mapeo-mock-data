# Mapeo Mock Data

Module and CLI to generate fake data for Mapeo

## Installation

_TODO_

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

- _required_ `--schema (-s)`: specifies the schema to generate data for. Use the `list-mapeo-schemas` command to learn which ones are available.
- _optional_ `--version (-v)`: specifies the schema version to use for `--schema`. Uses latest version by default.
- _optional_ `--count (-c)`: specifies the number of entries to generate. Uses `1` by default.
- _optional_ `--output (-o)`: specifies a path relative to the current working directory to write the generated data to. Logs to stdout by default.

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

_TODO_
