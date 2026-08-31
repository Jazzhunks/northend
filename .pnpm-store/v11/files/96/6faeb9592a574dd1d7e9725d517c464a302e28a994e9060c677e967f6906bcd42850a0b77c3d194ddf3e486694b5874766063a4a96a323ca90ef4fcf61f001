import type { ClientId, HarRequest, TargetId } from '@scalar/types/snippetz';
/**
 * Generate code examples for HAR requests
 */
export declare function snippetz(): {
    print<T extends TargetId>(target: T, client: ClientId<T>, request: Partial<HarRequest>): string | undefined;
    clients(): import("@scalar/types/snippetz").Target[];
    plugins(): {
        target: "c" | "clojure" | "csharp" | "dart" | "fsharp" | "go" | "http" | "java" | "js" | "kotlin" | "node" | "objc" | "ocaml" | "php" | "powershell" | "python" | "r" | "ruby" | "rust" | "shell" | "swift";
        client: "http" | "libcurl" | "clj_http" | "httpclient" | "restsharp" | "native" | "http1.1" | "asynchttp" | "nethttp" | "okhttp" | "unirest" | "axios" | "fetch" | "jquery" | "ofetch" | "xhr" | "undici" | "nsurlsession" | "cohttp" | "curl" | "guzzle" | "laravel" | "restmethod" | "webrequest" | "python3" | "requests" | "aiohttp" | "httpx_sync" | "httpx_async" | "httr2" | "reqwest" | "httpie" | "wget";
    }[];
    findPlugin: <T extends TargetId>(target: T | string, client: ClientId<T> | string) => import("@scalar/types/snippetz").Plugin | undefined;
    hasPlugin<T extends TargetId>(target: T | string, client: ClientId<T> | string): boolean;
};
//# sourceMappingURL=snippetz.d.ts.map