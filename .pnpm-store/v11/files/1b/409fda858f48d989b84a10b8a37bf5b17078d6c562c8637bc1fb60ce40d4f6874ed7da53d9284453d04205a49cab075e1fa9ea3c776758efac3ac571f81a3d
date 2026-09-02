import type { RequestBodyObject } from '@scalar/workspace-store/schemas/v3.1/strict/request-body';
type FormData = {
    mode: 'formdata';
    value: ({
        type: 'text';
        key: string;
        value: string;
    } | {
        type: 'file';
        key: string;
        value: File;
        contentType?: string;
    } | {
        type: 'blob';
        key: string;
        value: Blob;
        contentType?: string;
    })[];
};
type UrlEncoded = {
    mode: 'urlencoded';
    value: {
        key: string;
        value: string;
    }[];
};
type Raw = {
    mode: 'raw';
    value: string | File | Blob;
    contentType?: string;
};
export type RequestBody = FormData | UrlEncoded | Raw;
/**
 * Create the fetch request body
 */
export declare const buildRequestBody: (requestBody: RequestBodyObject | undefined, 
/** The key of the current example */
exampleName?: string, 
/** Selected anyOf/oneOf request-body variants keyed by schema path */
requestBodyCompositionSelection?: Record<string, number>) => RequestBody | null;
export {};
//# sourceMappingURL=build-request-body.d.ts.map