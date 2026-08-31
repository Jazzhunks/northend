import { Type } from '@scalar/typebox';
const HeaderSchema = Type.Object({
    name: Type.String(),
    value: Type.String(),
});
/**
 * This object contains detailed info about performed request.
 */
const RequestSchema = Type.Object({
    /** Absolute URL of the request (fragments are not included). */
    url: Type.String(),
    /** Request method (`GET`, `POST`, ...). */
    method: Type.String(),
    /** Request HTTP Version. */
    httpVersion: Type.String(),
    /** List of header objects. */
    headers: Type.Array(HeaderSchema),
    /** List of cookie objects. */
    cookies: Type.Array(HeaderSchema),
    /**
     * Total number of bytes from the start of the HTTP request message until
     * (and including) the double CRLF before the body.
     *
     * Set to `-1` if the info is not available.
     */
    headersSize: Type.Number(),
    /** List of query string objects. */
    queryString: Type.Array(HeaderSchema),
    /**
     * Size of the request body (POST data payload) in bytes.
     *
     * Set to `-1` if the info is not available.
     */
    bodySize: Type.Number(),
    /** Posted data info. */
    postData: Type.Optional(Type.Union([
        Type.Object({
            /** Mime type of posted data. */
            mimeType: Type.String(),
            text: Type.String(),
        }),
        Type.Object({
            /** Mime type of posted data. */
            mimeType: Type.String(),
            params: Type.Array(Type.Object({ name: Type.String(), value: Type.Optional(Type.String()) })),
        }),
    ])),
});
const ResponseSchema = Type.Object({
    status: Type.Number(),
    statusText: Type.String(),
    headers: Type.Array(HeaderSchema),
    cookies: Type.Array(HeaderSchema),
    httpVersion: Type.String(),
    redirectURL: Type.String(),
    headersSize: Type.Number(),
    bodySize: Type.Number(),
    content: Type.Object({
        size: Type.Number(),
        mimeType: Type.String(),
        encoding: Type.Optional(Type.String()),
        text: Type.Optional(Type.String()),
    }),
});
const HistoryEntrySchema = Type.Object({
    /**
     * Total elapsed time of the request in milliseconds.
     *
     * This is the sum of all timings available in the timings object
     * (i.e. not including `-1` values).
     */
    time: Type.Number(),
    /** Timestamp of the request. */
    timestamp: Type.Number(),
    /** Detailed info about the request. */
    request: RequestSchema,
    /** Detailed info about the response. */
    response: ResponseSchema,
    /** Meta data about the request. */
    meta: Type.Object({
        /** The example key for the request. */
        example: Type.String(),
    }),
    requestMetadata: Type.Object({
        /** Variables used in the request.
         *
         * Since HAR format does not support variables, we need to store them here.
         * This way we can easily re-use the request with the same variables.
         * We don't need to do any server + variables matching and replacement.
         */
        variables: Type.Record(Type.String(), Type.String()),
        // Other meta fields (e.g., server) can be added here in the future.
    }),
});
/**
 * Schema for the path method history.
 *
 * {
 *   "path": {
 *     "method": [Entry]
 *   }
 * }
 */
const PathMethodHistorySchema = Type.Record(Type.String(), Type.Record(Type.String(), Type.Array(HistoryEntrySchema)));
export const DocumentHistorySchema = Type.Record(Type.String(), PathMethodHistorySchema);
