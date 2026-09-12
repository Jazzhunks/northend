import { HTTP_METHODS } from '@scalar/helpers/http/http-methods';
import { Type } from '@scalar/typebox';
import { compose } from '../schemas/compose.js';
import { TraversedEntryObjectRef } from '../schemas/v3.1/strict/ref-definitions.js';
export const NavigationBaseSchemaDefinition = Type.Object({
    id: Type.String(),
    title: Type.String(),
});
export const TraversedDocumentSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('document'),
    name: Type.String(),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
    icon: Type.Optional(Type.String()),
}));
export const TraversedDescriptionSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('text'),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
}));
export const TraversedExampleSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('example'),
    name: Type.String(),
}));
export const TraversedOperationSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('operation'),
    ref: Type.String(),
    method: Type.Union(HTTP_METHODS.map((method) => Type.Literal(method))),
    path: Type.String(),
    isDeprecated: Type.Optional(Type.Boolean()),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
}));
export const TraversedAsyncApiOperationSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('asyncapi-operation'),
    operationName: Type.String(),
    action: Type.Union([Type.Literal('send'), Type.Literal('receive')]),
    channelName: Type.String(),
    channelAddress: Type.String(),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
}));
export const TraversedAsyncApiChannelSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('asyncapi-channel'),
    channelName: Type.String(),
    channelAddress: Type.String(),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
}));
export const TraversedAsyncApiMessageSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('asyncapi-message'),
    messageName: Type.String(),
    channelName: Type.String(),
}));
export const TraversedSchemaSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('model'),
    ref: Type.String(),
    name: Type.String(),
}));
export const TraversedWebhookSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('webhook'),
    ref: Type.String(),
    method: Type.Union(HTTP_METHODS.map((method) => Type.Literal(method))),
    name: Type.String(),
    isDeprecated: Type.Optional(Type.Boolean()),
}));
export const TraversedTagSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('tag'),
    name: Type.String(),
    description: Type.Optional(Type.String()),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
    isGroup: Type.Boolean(),
    isWebhooks: Type.Optional(Type.Boolean()),
    xKeys: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
}));
export const TraversedModelsSchemaDefinition = compose(NavigationBaseSchemaDefinition, Type.Object({
    type: Type.Literal('models'),
    name: Type.String(),
    children: Type.Optional(Type.Array(TraversedEntryObjectRef)),
}));
export const TraversedEntrySchemaDefinition = Type.Union([
    TraversedDescriptionSchemaDefinition,
    TraversedOperationSchemaDefinition,
    TraversedAsyncApiOperationSchemaDefinition,
    TraversedAsyncApiChannelSchemaDefinition,
    TraversedAsyncApiMessageSchemaDefinition,
    TraversedSchemaSchemaDefinition,
    TraversedTagSchemaDefinition,
    TraversedWebhookSchemaDefinition,
    TraversedExampleSchemaDefinition,
    TraversedDocumentSchemaDefinition,
    TraversedModelsSchemaDefinition,
]);
