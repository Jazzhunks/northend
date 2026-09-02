import type { CodeBuilderOptions } from '../../httpsnippet-lite/helpers/code-builder.js';
import type { SnippetRequest } from '../../httpsnippet-lite/helpers/snippet-request.js';
type ClientId = string;
type ClientInfo = {
    key: ClientId;
    title: string;
    link: string;
    description: string;
};
type SimpleMerge<Destination, Source> = {
    [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;
export type Converter<T extends Record<string, any>> = (request: SnippetRequest, options?: SimpleMerge<CodeBuilderOptions, T>) => string;
export type Client<T extends Record<string, any> = Record<string, any>> = {
    info: ClientInfo;
    convert: Converter<T>;
};
export {};
//# sourceMappingURL=target.d.ts.map