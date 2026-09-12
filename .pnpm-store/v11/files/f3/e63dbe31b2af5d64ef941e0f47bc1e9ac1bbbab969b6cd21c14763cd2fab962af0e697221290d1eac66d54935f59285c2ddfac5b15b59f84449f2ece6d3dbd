export type UploadTmpDocumentState = {
    type: 'error';
    error: unknown;
} | {
    type: 'uploading';
} | {
    type: 'processing';
} | {
    type: 'loading';
} | {
    type: 'done';
};
export declare function getTmpDocFromLocalStorage(): {
    namespace: string;
    slug: string;
} | undefined;
export declare function removeTmpDocFromLocalStorage(): void;
/**
 * Handle uploading a temporary OpenAPI document.
 */
export declare function useUploadTmpDocument(): {
    uploadTempDocument: (document: string, isAgent?: boolean) => Promise<{
        url: string;
        namespace: string;
        slug: string;
    } | undefined>;
    uploadState: import("vue").Ref<UploadTmpDocumentState | undefined, UploadTmpDocumentState | undefined>;
};
//# sourceMappingURL=use-upload-tmp-document.d.ts.map