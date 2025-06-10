export function cleanSchema(schema: string): string {
    return schema
        .replace(/[\n\r\t]/g, ' ')
        .replace(/ {2,}/g, ' ')
        .trim();
}
