import * as Layer from "effect/Layer";
import * as EtagImpl from "effect/unstable/http/Etag";
import * as Platform from "effect/unstable/http/HttpPlatform";
import * as ServerResponse from "effect/unstable/http/HttpServerResponse";
/**
 * Creates the Node `HttpPlatform`, serving file responses from Node readable
 * streams and adding MIME type and content-length headers when needed.
 *
 * @category constructors
 * @since 4.0.0
 */
export declare const make: import("effect/Effect").Effect<{
    readonly fileResponse: (path: string, options?: ServerResponse.Options.WithContent & {
        readonly bytesToRead?: import("effect/FileSystem").SizeInput | undefined;
        readonly chunkSize?: import("effect/FileSystem").SizeInput | undefined;
        readonly offset?: import("effect/FileSystem").SizeInput | undefined;
    }) => import("effect/Effect").Effect<ServerResponse.HttpServerResponse, import("effect/PlatformError").PlatformError>;
    readonly fileWebResponse: (file: import("effect/unstable/http/HttpBody").HttpBody.FileLike, options?: ServerResponse.Options.WithContent & {
        readonly bytesToRead?: import("effect/FileSystem").SizeInput | undefined;
        readonly chunkSize?: import("effect/FileSystem").SizeInput | undefined;
        readonly offset?: import("effect/FileSystem").SizeInput | undefined;
    }) => import("effect/Effect").Effect<ServerResponse.HttpServerResponse>;
}, never, import("effect/FileSystem").FileSystem | EtagImpl.Generator>;
/**
 * Provides the Node `HttpPlatform` together with the filesystem and ETag
 * services it needs for file responses.
 *
 * @category layers
 * @since 4.0.0
 */
export declare const layer: Layer.Layer<Platform.HttpPlatform>;
//# sourceMappingURL=NodeHttpPlatform.d.ts.map