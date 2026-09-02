type Header = {
    name: string;
    value: string;
};
/**
 * This object contains detailed info about performed request.
 */
type Request = {
    /** Absolute URL of the request (fragments are not included). */
    url: string;
    /** Request method (`GET`, `POST`, ...). */
    method: string;
    /** Request HTTP Version. */
    httpVersion: string;
    /** List of header objects. */
    headers: Header[];
    /** List of cookie objects. */
    cookies: Header[];
    /**
     * Total number of bytes from the start of the HTTP request message until
     * (and including) the double CRLF before the body.
     *
     * Set to `-1` if the info is not available.
     */
    headersSize: number;
    /** List of query string objects. */
    queryString: Header[];
    /**
     * Size of the request body (POST data payload) in bytes.
     *
     * Set to `-1` if the info is not available.
     */
    bodySize: number;
    /** Posted data info. */
    postData?: {
        /** Mime type of posted data. */
        mimeType: string;
        text: string;
    } | {
        /** Mime type of posted data. */
        mimeType: string;
        params: {
            name: string;
            value?: string;
        }[];
    };
};
type Response = {
    /** Response status. */
    status: number;
    /** Response status description. */
    statusText: string;
    /** Response HTTP Version. */
    httpVersion: string;
    /** List of cookie objects. */
    cookies: Header[];
    /** List of header objects. */
    headers: Header[];
    /** Details about the response body. */
    content: {
        size: number;
        mimeType: string;
        encoding?: string;
        text?: string;
    };
    /** Redirection target URL from the Location response header. */
    redirectURL: string;
    /**
     * Total number of bytes from the start of the HTTP response message until
     * (and including) the double CRLF before the body.
     *
     * Set to `-1` if the info is not available.
     *
     * _The size of received response-headers is computed only from headers
     * that are really received from the server. Additional headers appended by
     * the browser are not included in this number, but they appear in the list
     * of header objects._
     */
    headersSize: number;
    /**
     * Size of the received response body in bytes.
     *
     * - Set to zero in case of responses coming from the cache (`304`).
     * - Set to `-1` if the info is not available.
     */
    bodySize: number;
};
export type HistoryEntry = {
    /**
     * Total elapsed time of the request in milliseconds.
     *
     * This is the sum of all timings available in the timings object
     * (i.e. not including `-1` values).
     */
    time: number;
    /** Timestamp of the request. */
    timestamp: number;
    /** Detailed info about the request. */
    request: Request;
    /** Detailed info about the response. */
    response: Response;
    /** Meta data about the request. */
    meta: {
        /** The example key for the request. */
        example: string;
    };
    /** Metadata about the request. */
    requestMetadata: {
        /** Variables used in the request. */
        variables: Record<string, string>;
    };
};
/**
 * Type for the path method history.
 *
 * {
 *   "path": {
 *     "method": [Entry]
 *   }
 * }
 */
export type PathMethodHistory = Record<string, Record<string, HistoryEntry[]>>;
export declare const DocumentHistorySchema: import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
    /**
     * Total elapsed time of the request in milliseconds.
     *
     * This is the sum of all timings available in the timings object
     * (i.e. not including `-1` values).
     */
    time: import("@scalar/typebox").TNumber;
    /** Timestamp of the request. */
    timestamp: import("@scalar/typebox").TNumber;
    /** Detailed info about the request. */
    request: import("@scalar/typebox").TObject<{
        /** Absolute URL of the request (fragments are not included). */
        url: import("@scalar/typebox").TString;
        /** Request method (`GET`, `POST`, ...). */
        method: import("@scalar/typebox").TString;
        /** Request HTTP Version. */
        httpVersion: import("@scalar/typebox").TString;
        /** List of header objects. */
        headers: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            name: import("@scalar/typebox").TString;
            value: import("@scalar/typebox").TString;
        }>>;
        /** List of cookie objects. */
        cookies: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            name: import("@scalar/typebox").TString;
            value: import("@scalar/typebox").TString;
        }>>;
        /**
         * Total number of bytes from the start of the HTTP request message until
         * (and including) the double CRLF before the body.
         *
         * Set to `-1` if the info is not available.
         */
        headersSize: import("@scalar/typebox").TNumber;
        /** List of query string objects. */
        queryString: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            name: import("@scalar/typebox").TString;
            value: import("@scalar/typebox").TString;
        }>>;
        /**
         * Size of the request body (POST data payload) in bytes.
         *
         * Set to `-1` if the info is not available.
         */
        bodySize: import("@scalar/typebox").TNumber;
        /** Posted data info. */
        postData: import("@scalar/typebox").TOptional<import("@scalar/typebox").TUnion<[import("@scalar/typebox").TObject<{
            /** Mime type of posted data. */
            mimeType: import("@scalar/typebox").TString;
            text: import("@scalar/typebox").TString;
        }>, import("@scalar/typebox").TObject<{
            /** Mime type of posted data. */
            mimeType: import("@scalar/typebox").TString;
            params: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
                name: import("@scalar/typebox").TString;
                value: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
            }>>;
        }>]>>;
    }>;
    /** Detailed info about the response. */
    response: import("@scalar/typebox").TObject<{
        status: import("@scalar/typebox").TNumber;
        statusText: import("@scalar/typebox").TString;
        headers: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            name: import("@scalar/typebox").TString;
            value: import("@scalar/typebox").TString;
        }>>;
        cookies: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            name: import("@scalar/typebox").TString;
            value: import("@scalar/typebox").TString;
        }>>;
        httpVersion: import("@scalar/typebox").TString;
        redirectURL: import("@scalar/typebox").TString;
        headersSize: import("@scalar/typebox").TNumber;
        bodySize: import("@scalar/typebox").TNumber;
        content: import("@scalar/typebox").TObject<{
            size: import("@scalar/typebox").TNumber;
            mimeType: import("@scalar/typebox").TString;
            encoding: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
            text: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        }>;
    }>;
    /** Meta data about the request. */
    meta: import("@scalar/typebox").TObject<{
        /** The example key for the request. */
        example: import("@scalar/typebox").TString;
    }>;
    requestMetadata: import("@scalar/typebox").TObject<{
        /** Variables used in the request.
         *
         * Since HAR format does not support variables, we need to store them here.
         * This way we can easily re-use the request with the same variables.
         * We don't need to do any server + variables matching and replacement.
         */
        variables: import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TString>;
    }>;
}>>>>>;
/**
 * Type for the document history.
 *
 * {
 *   "documentName": {
 *     "path": {
 *       "method": [Entry]
 *     }
 *   }
 * }
 */
export type DocumentHistory = Record<string, PathMethodHistory>;
export {};
//# sourceMappingURL=schema.d.ts.map