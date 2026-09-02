import { type HttpMethod } from '@scalar/helpers/http/http-methods';
import { type TLiteral } from '@scalar/typebox';
import type { AsyncApiInfoObject } from '@scalar/types/asyncapi/3.1';
import type { InfoObject } from '../schemas/v3.1/strict/info.js';
import type { OperationObject } from '../schemas/v3.1/strict/operation.js';
import type { SchemaObject } from '../schemas/v3.1/strict/schema.js';
import type { TagObject } from '../schemas/v3.1/strict/tag.js';
export declare const NavigationBaseSchemaDefinition: import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>;
type BaseSchema = {
    /**
     * The unique identifier for the entry
     *
     * Must be unique across the entire navigation structure.
     */
    id: string;
    /** The user readable title of the entry */
    title: string;
};
export declare const TraversedDocumentSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"document">;
    name: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
    icon: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
}>]>;
/**
 * An entry representing an OpenAPI in the navigation structure.
 *
 * Used in the client to represent the root document and its operations or tags.
 */
export type TraversedDocument = BaseSchema & {
    type: 'document';
    /** Document name */
    name: string;
    /** Child entries under the document */
    children?: TraversedEntry[];
    icon?: string;
};
export declare const TraversedDescriptionSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"text">;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>;
/**
 * An entry representing a markdown description in the navigation structure.
 */
export type TraversedDescription = BaseSchema & {
    type: 'text';
    children?: TraversedEntry[];
};
export declare const TraversedExampleSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"example">;
    name: import("@scalar/typebox").TString;
}>]>;
/**
 * An entry representing an operation example in the navigation structure.
 */
export type TraversedExample = BaseSchema & {
    type: 'example';
    name: string;
};
export declare const TraversedOperationSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"operation">;
    ref: import("@scalar/typebox").TString;
    method: TLiteral<HttpMethod>;
    path: import("@scalar/typebox").TString;
    isDeprecated: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>;
/**
 * An entry representing an operation in the navigation structure.
 */
export type TraversedOperation = BaseSchema & {
    type: 'operation';
    ref: string;
    method: HttpMethod;
    path: string;
    isDeprecated?: boolean;
    children?: TraversedEntry[];
};
export declare const TraversedAsyncApiOperationSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"asyncapi-operation">;
    operationName: import("@scalar/typebox").TString;
    action: import("@scalar/typebox").TUnion<[TLiteral<"send">, TLiteral<"receive">]>;
    channelName: import("@scalar/typebox").TString;
    channelAddress: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>;
/**
 * An entry representing an AsyncAPI operation in the navigation structure.
 */
export type TraversedAsyncApiOperation = BaseSchema & {
    type: 'asyncapi-operation';
    /** Key in `document.operations` */
    operationName: string;
    action: 'send' | 'receive';
    /** Resolved channel key in `document.channels` */
    channelName: string;
    /** Channel address for display and routing */
    channelAddress: string;
    /** Messages available on this operation */
    children?: TraversedEntry[];
};
export declare const TraversedAsyncApiChannelSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"asyncapi-channel">;
    channelName: import("@scalar/typebox").TString;
    channelAddress: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>;
/**
 * An entry representing an AsyncAPI channel in the navigation structure.
 */
export type TraversedAsyncApiChannel = BaseSchema & {
    type: 'asyncapi-channel';
    /** Key in `document.channels` */
    channelName: string;
    /** Channel address for display and routing */
    channelAddress: string;
    /** Operations on the channel */
    children?: TraversedEntry[];
};
export declare const TraversedAsyncApiMessageSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"asyncapi-message">;
    messageName: import("@scalar/typebox").TString;
    channelName: import("@scalar/typebox").TString;
}>]>;
/**
 * An entry representing an AsyncAPI message in the navigation structure.
 */
export type TraversedAsyncApiMessage = BaseSchema & {
    type: 'asyncapi-message';
    /** Key in `channel.messages` */
    messageName: string;
    /** Parent channel key in `document.channels` */
    channelName: string;
};
export declare const TraversedSchemaSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"model">;
    ref: import("@scalar/typebox").TString;
    name: import("@scalar/typebox").TString;
}>]>;
/**
 * An entry representing a model in the navigation structure.
 */
export type TraversedSchema = BaseSchema & {
    type: 'model';
    ref: string;
    name: string;
};
export declare const TraversedWebhookSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"webhook">;
    ref: import("@scalar/typebox").TString;
    method: TLiteral<HttpMethod>;
    name: import("@scalar/typebox").TString;
    isDeprecated: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
}>]>;
/**
 * An entry representing a webhook in the navigation structure.
 */
export type TraversedWebhook = BaseSchema & {
    type: 'webhook';
    ref: string;
    method: HttpMethod;
    name: string;
    isDeprecated?: boolean;
};
export declare const TraversedTagSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"tag">;
    name: import("@scalar/typebox").TString;
    description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
    isGroup: import("@scalar/typebox").TBoolean;
    isWebhooks: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
    xKeys: import("@scalar/typebox").TOptional<import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TUnknown>>;
}>]>;
/**
 * An entry representing a tag in the navigation structure.
 *
 * Used to group operations or webhooks under a common heading.
 */
export type TraversedTag = BaseSchema & {
    type: 'tag';
    name: string;
    description?: string;
    children?: TraversedEntry[];
    isGroup: boolean;
    isWebhooks?: boolean;
    xKeys?: Record<string, unknown>;
};
export declare const TraversedModelsSchemaDefinition: import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"models">;
    name: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>;
/**
 *  Top level models navigation entry.
 */
export type TraversedModels = BaseSchema & {
    type: 'models';
    name: string;
    children?: TraversedEntry[];
};
export declare const TraversedEntrySchemaDefinition: import("@scalar/typebox").TUnion<[import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"text">;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"operation">;
    ref: import("@scalar/typebox").TString;
    method: TLiteral<HttpMethod>;
    path: import("@scalar/typebox").TString;
    isDeprecated: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"asyncapi-operation">;
    operationName: import("@scalar/typebox").TString;
    action: import("@scalar/typebox").TUnion<[TLiteral<"send">, TLiteral<"receive">]>;
    channelName: import("@scalar/typebox").TString;
    channelAddress: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"asyncapi-channel">;
    channelName: import("@scalar/typebox").TString;
    channelAddress: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"asyncapi-message">;
    messageName: import("@scalar/typebox").TString;
    channelName: import("@scalar/typebox").TString;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"model">;
    ref: import("@scalar/typebox").TString;
    name: import("@scalar/typebox").TString;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"tag">;
    name: import("@scalar/typebox").TString;
    description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
    isGroup: import("@scalar/typebox").TBoolean;
    isWebhooks: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
    xKeys: import("@scalar/typebox").TOptional<import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TUnknown>>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"webhook">;
    ref: import("@scalar/typebox").TString;
    method: TLiteral<HttpMethod>;
    name: import("@scalar/typebox").TString;
    isDeprecated: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"example">;
    name: import("@scalar/typebox").TString;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"document">;
    name: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
    icon: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
}>]>, import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
    id: import("@scalar/typebox").TString;
    title: import("@scalar/typebox").TString;
}>, import("@scalar/typebox").TObject<{
    type: TLiteral<"models">;
    name: import("@scalar/typebox").TString;
    children: import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TRef<"TraversedEntryObject">>>;
}>]>]>;
export type TraversedEntry = TraversedDescription | TraversedOperation | TraversedAsyncApiOperation | TraversedAsyncApiChannel | TraversedAsyncApiMessage | TraversedSchema | TraversedTag | TraversedWebhook | TraversedExample | TraversedDocument | TraversedModels;
/**
 * Type helper for when we are storing the parent entry in the entry itself.
 * The parent is recursively defined to also include its own parent, except for
 * TraversedDocument which can be a terminal parent without requiring its own parent.
 */
export type WithParent<Entry extends TraversedEntry> = Entry & {
    parent: WithParent<TraversedEntry> | TraversedDocument;
};
export type DocumentIdProps = {
    name: string;
    info: InfoObject | AsyncApiInfoObject;
    type: 'document';
};
type DescriptionIdProps = {
    info: InfoObject | AsyncApiInfoObject;
    type: 'text';
    slug?: string;
    depth?: number;
    value: string;
    parentId: string;
};
export type ParentTag = {
    tag: TagObject;
    id: string;
};
type TagProps = {
    parentId: string;
    tag: TagObject;
    type: 'tag';
    /**
     * Set when `tag` is a `tagGroup` entry so IDs stay distinct from same-named
     * OpenAPI tags and from other groups.
     */
    isGroup?: boolean;
};
type OperationProps = {
    parentId: string;
    operation: OperationObject;
    path: string;
    method: string;
    type: 'operation';
    parentTag?: ParentTag;
};
type WebhookProps = {
    parentId: string;
    webhook?: OperationObject;
    name: string;
    method?: string;
    type: 'webhook';
    parentTag?: ParentTag;
};
type ModelProps = {
    parentId: string;
    schema?: SchemaObject;
    name?: string;
    type: 'model';
    parentTag?: ParentTag;
};
type ExampleProps = {
    parentId: string;
    name: string;
    type: 'example';
};
type AsyncApiOperationProps = {
    parentId: string;
    operationName: string;
    type: 'asyncapi-operation';
    parentTag?: ParentTag;
};
type AsyncApiChannelProps = {
    parentId: string;
    channelName: string;
    type: 'asyncapi-channel';
    parentTag?: ParentTag;
};
type AsyncApiMessageProps = {
    parentId: string;
    messageName: string;
    channelName: string;
    type: 'asyncapi-message';
};
export type IdGeneratorProps = DocumentIdProps | DescriptionIdProps | TagProps | OperationProps | AsyncApiOperationProps | AsyncApiChannelProps | AsyncApiMessageProps | WebhookProps | ModelProps | ExampleProps;
export type IdGenerator = (props: IdGeneratorProps) => string;
export {};
//# sourceMappingURL=navigation.d.ts.map