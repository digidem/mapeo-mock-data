/// <reference types="node" resolution-mode="require"/>
declare module "faker" {
    import { JSONSchemaFaker } from "json-schema-faker";
    /**
     * @param {*} schema
     */
    export function createFakerSchema(schema: any): any;
    export { JSONSchemaFaker };
}
declare module "index" {
    /**
     * @typedef {{version: string, path: string, schema: any}} SchemaInfo
     * @typedef {Array<SchemaInfo>} SchemaInfoList
     */
    export function listSchemas(): {
        [name: string]: string[];
    };
    /**
     * @param {string} schemaName
     * @param {{version?: string, count?: number}} [options]
     * @returns {Promise<Array<import('type-fest').JsonValue>>}
     */
    export function generate(schemaName: string, { version, count }?: {
        version?: string | undefined;
        count?: number | undefined;
    } | undefined): Promise<Array<import("node_modules/type-fest/index").JsonValue>>;
    export type SchemaInfo = {
        version: string;
        path: string;
        schema: any;
    };
    export type SchemaInfoList = Array<SchemaInfo>;
    import path from "node:path";
}
