import { JsonValue } from 'type-fest'

declare function listSchemas(): { [name: string]: Array<string> }

declare function generate(
  schemaName: string,
  opts?: { version?: string; count?: number },
): Promise<Array<JsonValue>>
