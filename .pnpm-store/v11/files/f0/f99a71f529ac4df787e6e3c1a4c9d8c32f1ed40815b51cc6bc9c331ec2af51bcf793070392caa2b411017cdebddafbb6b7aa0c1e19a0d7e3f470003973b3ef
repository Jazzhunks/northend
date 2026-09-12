import type { EncodingObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
/** A single serialized form field, ready to become a multipart part or a urlencoded pair. */
export type SerializedFormProperty = {
    key: string;
    value: string;
};
/**
 * Serialize a `multipart/form-data` or `application/x-www-form-urlencoded` property
 * according to its OpenAPI Encoding Object when `style` / `explode` / `allowReserved`
 * is set. The value is serialized RFC6570-style (like a query parameter) into one or
 * more key/value parts — for example `style: deepObject` turns `{ address: { city } }`
 * into `address[city]=...` bracket notation, and `style: form, explode: true` breaks an
 * object into one part per property.
 *
 * Returns `null` when the encoding does not opt into style-based serialization, so callers
 * keep their default handling (JSON for objects, `contentType` parts, file uploads). This
 * is shared by the request builder (`build-request-body`) and the code-snippet generator
 * (`process-body`) so the request sent over the wire matches the generated snippet.
 *
 * @see https://spec.openapis.org/oas/v3.1.1.html#encoding-object
 */
export declare const serializeFormPropertyWithEncoding: (key: string, value: unknown, encoding: EncodingObject | undefined) => SerializedFormProperty[] | null;
//# sourceMappingURL=serialize-form-property.d.ts.map