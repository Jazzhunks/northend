import * as Layer from "effect/Layer";
import * as Etag from "effect/unstable/http/Etag";
import * as Platform from "effect/unstable/http/HttpPlatform";
import * as Response from "effect/unstable/http/HttpServerResponse";
import * as BunFileSystem from "./BunFileSystem.js";
/**
 * @category constructors
 * @since 4.0.0
 */
const make = /*#__PURE__*/Platform.make({
  fileResponse(path, status, statusText, headers, start, end, _contentLength) {
    let file = Bun.file(path);
    if (start > 0 || end !== undefined) {
      file = file.slice(start, end);
    }
    return Response.raw(file, {
      headers,
      status,
      statusText
    });
  },
  fileWebResponse(file, status, statusText, headers, _options) {
    return Response.raw(file, {
      headers,
      status,
      statusText
    });
  }
});
/**
 * Layer that provides the Bun `HttpPlatform`, including file responses backed by `Bun.file`.
 *
 * @category layers
 * @since 4.0.0
 */
export const layer = /*#__PURE__*/Layer.effect(Platform.HttpPlatform)(make).pipe(/*#__PURE__*/Layer.provide(BunFileSystem.layer), /*#__PURE__*/Layer.provide(Etag.layer));
//# sourceMappingURL=BunHttpPlatform.js.map