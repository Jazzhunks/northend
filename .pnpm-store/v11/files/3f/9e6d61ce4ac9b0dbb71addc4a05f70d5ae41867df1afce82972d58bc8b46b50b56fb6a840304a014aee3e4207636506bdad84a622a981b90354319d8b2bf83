import type { LanguageFn } from 'highlight.js';
/**
 * Python grammar that extends highlight.js' bundled grammar with call-site
 * highlighting.
 *
 * The grammar shipped with highlight.js only scopes function and class
 * *definitions* (`def name`, `class Name`) plus a fixed list of built-ins. It
 * never scopes *call sites*, unlike the JavaScript, Go, and Ruby grammars which
 * colour every `.method()` as a function title. Because real-world API snippets
 * are almost entirely method calls (for example `conn.request(...)` or
 * `response.json()`), Python code rendered as a wall of unstyled grey text and
 * looked far less highlighted than other languages (DOC-5618).
 *
 * We add a single rule that colours any identifier immediately followed by `(`
 * as a function title, mirroring how highlight.js' own JavaScript grammar
 * handles this. Reserved words and the grammar's known built-ins, literals, and
 * types are excluded so they keep their existing scopes, and the leading word
 * boundary prevents the rule from matching the tail end of an excluded word.
 */
declare const python: LanguageFn;
export default python;
//# sourceMappingURL=python.d.ts.map