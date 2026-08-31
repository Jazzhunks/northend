import { Type } from '@scalar/typebox';
import { compose } from '../../../schemas/compose.js';
import { extensions } from '../../../schemas/extensions.js';
import { xScalarEnvironmentsSchema, } from '../../../schemas/extensions/document/x-scalar-environments.js';
import { XScalarIconSchema } from '../../../schemas/extensions/document/x-scalar-icon.js';
import { XScalarIsDirtySchema } from '../../../schemas/extensions/document/x-scalar-is-dirty.js';
import { XScalarOriginalDocumentHashSchema, } from '../../../schemas/extensions/document/x-scalar-original-document-hash.js';
import { XScalarOriginalSourceUrlSchema, } from '../../../schemas/extensions/document/x-scalar-original-source-url.js';
import { XScalarRegistryMetaSchema, } from '../../../schemas/extensions/document/x-scalar-registry-meta.js';
import { XScalarWatchModeSchema } from '../../../schemas/extensions/document/x-scalar-watch-mode.js';
import { XPostResponseSchema } from '../../../schemas/extensions/general/x-post-response.js';
import { XPreRequestSchema } from '../../../schemas/extensions/general/x-pre-request.js';
import { XScalarActiveEnvironmentSchema, } from '../../../schemas/extensions/general/x-scalar-active-environment.js';
import { xScalarCookiesSchema } from '../../../schemas/extensions/general/x-scalar-cookies.js';
import { XScalarOrderSchema } from '../../../schemas/extensions/general/x-scalar-order.js';
import { XScalarSelectedServerSchema, } from '../../../schemas/extensions/server/x-scalar-selected-server.js';
import { XTagGroupsSchema } from '../../../schemas/extensions/tag/x-tag-groups.js';
import { TraversedAsyncApiChannelSchemaDefinition, TraversedAsyncApiMessageSchemaDefinition, TraversedAsyncApiOperationSchemaDefinition, TraversedDescriptionSchemaDefinition, TraversedDocumentSchemaDefinition, TraversedEntrySchemaDefinition, TraversedOperationSchemaDefinition, TraversedSchemaSchemaDefinition, TraversedTagSchemaDefinition, TraversedWebhookSchemaDefinition, } from '../../../schemas/navigation.js';
import { CallbackObjectSchemaDefinition } from './callback.js';
import { ComponentsObjectSchemaDefinition, SecuritySchemesSchemaDefinition } from './components.js';
import { ContactObjectSchemaDefinition } from './contact.js';
import { DiscriminatorObjectSchemaDefinition } from './discriminator.js';
import { EncodingObjectSchemaDefinition } from './encoding.js';
import { ExampleObjectSchemaDefinition } from './example.js';
import { ExternalDocumentationObjectSchemaDefinition } from './external-documentation.js';
import { HeaderObjectSchemaDefinition } from './header.js';
import { InfoObjectSchemaDefinition } from './info.js';
import { LicenseObjectSchemaDefinition } from './license.js';
import { LinkObjectSchemaDefinition } from './link.js';
import { MediaTypeObjectSchemaDefinition } from './media-type.js';
import { OAuthFlowsObjectSchemaDefinition } from './oauthflows.js';
import { OperationObjectSchemaDefinition } from './operation.js';
import { ParameterObjectSchemaDefinition } from './parameter.js';
import { PathItemObjectSchemaDefinition } from './path-item.js';
import { PathsObjectSchemaDefinition } from './paths.js';
import { ComponentsObjectRef, ExternalDocumentationObjectRef, InfoObjectRef, PathsObjectRef, REF_DEFINITIONS, SecurityRequirementObjectRef, ServerObjectRef, TagObjectRef, TraversedDocumentObjectRef, } from './ref-definitions.js';
import { RequestBodyObjectSchemaDefinition } from './request-body.js';
import { ResponseObjectSchemaDefinition } from './response.js';
import { ResponsesObjectSchemaDefinition } from './responses.js';
import { SchemaObjectSchemaDefinition } from './schema.js';
import { SecurityRequirementObjectSchemaDefinition } from './security-requirement.js';
import { SecuritySchemeObjectSchemaDefinition } from './security-scheme.js';
import { ServerObjectSchemaDefinition } from './server.js';
import { ServerVariableObjectSchemaDefinition } from './server-variable.js';
import { TagObjectSchemaDefinition } from './tag.js';
import { XMLObjectSchemaDefinition } from './xml.js';
export const OpenApiExtensionsSchema = compose(Type.Partial(Type.Object({
    'x-original-oas-version': Type.String(),
    [extensions.document.navigation]: TraversedDocumentObjectRef,
})), XScalarOriginalSourceUrlSchema, XTagGroupsSchema, xScalarEnvironmentsSchema, XScalarSelectedServerSchema, XScalarIconSchema, XScalarOrderSchema, xScalarCookiesSchema, XScalarOriginalDocumentHashSchema, XScalarIsDirtySchema, XScalarActiveEnvironmentSchema, XScalarWatchModeSchema, XScalarRegistryMetaSchema, XPreRequestSchema, XPostResponseSchema);
const OpenApiDocumentSchemaDefinition = compose(Type.Object({
    /** REQUIRED. This string MUST be the version number of the OpenAPI Specification that the OpenAPI Document uses. The openapi field SHOULD be used by tooling to interpret the OpenAPI Document. This is not related to the API info.version string. */
    openapi: Type.String(),
    /** REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required. */
    info: InfoObjectRef,
    /** The default value for the $schema keyword within Schema Objects contained within this OAS document. This MUST be in the form of a URI. */
    jsonSchemaDialect: Type.Optional(Type.String()),
    /** An array of Server Objects, which provide connectivity information to a target server. If the servers field is not provided, or is an empty array, the default value would be a Server Object with a url value of /. */
    servers: Type.Optional(Type.Array(ServerObjectRef)),
    /** The available paths and operations for the API. */
    paths: Type.Optional(PathsObjectRef),
    /** The incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement. Closely related to the callbacks feature, this section describes requests initiated other than by an API call, for example by an out of band registration. The key name is a unique string to refer to each webhook, while the (optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the expected responses. An example is available. */
    webhooks: Type.Optional(PathsObjectRef),
    /** An element to hold various Objects for the OpenAPI Description. */
    components: Type.Optional(ComponentsObjectRef),
    /** A declaration of which security mechanisms can be used across the API. The list of values includes alternative Security Requirement Objects that can be used. Only one of the Security Requirement Objects need to be satisfied to authorize a request. Individual operations can override this definition. The list can be incomplete, up to being empty or absent. To make security explicitly optional, an empty security requirement ({}) can be included in the array. */
    security: Type.Optional(Type.Array(SecurityRequirementObjectRef)),
    /** A list of tags used by the OpenAPI Description with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique. */
    tags: Type.Optional(Type.Array(TagObjectRef)),
    /** Additional external documentation. */
    externalDocs: Type.Optional(ExternalDocumentationObjectRef),
}), OpenApiExtensionsSchema);
// ----- Module Definition ----
const module = Type.Module({
    [REF_DEFINITIONS.ComponentsObject]: ComponentsObjectSchemaDefinition,
    [REF_DEFINITIONS.SecurityRequirementObject]: SecurityRequirementObjectSchemaDefinition,
    [REF_DEFINITIONS.TagObject]: TagObjectSchemaDefinition,
    [REF_DEFINITIONS.CallbackObject]: CallbackObjectSchemaDefinition,
    [REF_DEFINITIONS.PathItemObject]: PathItemObjectSchemaDefinition,
    [REF_DEFINITIONS.PathsObject]: PathsObjectSchemaDefinition,
    [REF_DEFINITIONS.OperationObject]: OperationObjectSchemaDefinition,
    [REF_DEFINITIONS.SchemaObject]: SchemaObjectSchemaDefinition,
    [REF_DEFINITIONS.EncodingObject]: EncodingObjectSchemaDefinition,
    [REF_DEFINITIONS.MediaTypeObject]: MediaTypeObjectSchemaDefinition,
    [REF_DEFINITIONS.HeaderObject]: HeaderObjectSchemaDefinition,
    [REF_DEFINITIONS.ServerObject]: ServerObjectSchemaDefinition,
    [REF_DEFINITIONS.ExternalDocumentationObject]: ExternalDocumentationObjectSchemaDefinition,
    [REF_DEFINITIONS.InfoObject]: InfoObjectSchemaDefinition,
    [REF_DEFINITIONS.ContactObject]: ContactObjectSchemaDefinition,
    [REF_DEFINITIONS.LicenseObject]: LicenseObjectSchemaDefinition,
    [REF_DEFINITIONS.ResponseObject]: ResponseObjectSchemaDefinition,
    [REF_DEFINITIONS.ResponsesObject]: ResponsesObjectSchemaDefinition,
    [REF_DEFINITIONS.ParameterObject]: ParameterObjectSchemaDefinition,
    [REF_DEFINITIONS.ExampleObject]: ExampleObjectSchemaDefinition,
    [REF_DEFINITIONS.RequestBodyObject]: RequestBodyObjectSchemaDefinition,
    [REF_DEFINITIONS.SecuritySchemes]: SecuritySchemesSchemaDefinition,
    [REF_DEFINITIONS.SecuritySchemeObject]: SecuritySchemeObjectSchemaDefinition,
    [REF_DEFINITIONS.LinkObject]: LinkObjectSchemaDefinition,
    [REF_DEFINITIONS.XMLObject]: XMLObjectSchemaDefinition,
    [REF_DEFINITIONS.DiscriminatorObject]: DiscriminatorObjectSchemaDefinition,
    [REF_DEFINITIONS.OAuthFlowsObject]: OAuthFlowsObjectSchemaDefinition,
    [REF_DEFINITIONS.ServerVariableObject]: ServerVariableObjectSchemaDefinition,
    OpenApiDocument: OpenApiDocumentSchemaDefinition,
    // Navigation schemas
    [REF_DEFINITIONS.TraversedDescriptionObject]: TraversedDescriptionSchemaDefinition,
    [REF_DEFINITIONS.TraversedOperationObject]: TraversedOperationSchemaDefinition,
    [REF_DEFINITIONS.TraversedAsyncApiOperationObject]: TraversedAsyncApiOperationSchemaDefinition,
    [REF_DEFINITIONS.TraversedAsyncApiChannelObject]: TraversedAsyncApiChannelSchemaDefinition,
    [REF_DEFINITIONS.TraversedAsyncApiMessageObject]: TraversedAsyncApiMessageSchemaDefinition,
    [REF_DEFINITIONS.TraversedSchemaObject]: TraversedSchemaSchemaDefinition,
    [REF_DEFINITIONS.TraversedWebhookObject]: TraversedWebhookSchemaDefinition,
    [REF_DEFINITIONS.TraversedTagObject]: TraversedTagSchemaDefinition,
    [REF_DEFINITIONS.TraversedEntryObject]: TraversedEntrySchemaDefinition,
    [REF_DEFINITIONS.TraversedDocumentObject]: TraversedDocumentSchemaDefinition,
    // Enforces that all references are included in the module
});
//  ----- Schemas ----
export const OpenAPIDocumentSchema = module.Import('OpenApiDocument');
export const ComponentsObjectSchema = module.Import('ComponentsObject');
export const SecurityRequirementObjectSchema = module.Import('SecurityRequirementObject');
export const TagObjectSchema = module.Import('TagObject');
export const CallbackObjectSchema = module.Import('CallbackObject');
export const PathItemObjectSchema = module.Import('PathItemObject');
export const PathsObjectSchema = module.Import('PathsObject');
export const OperationObjectSchema = module.Import('OperationObject');
export const SchemaObjectSchema = module.Import('SchemaObject');
export const EncodingObjectSchema = module.Import('EncodingObject');
export const MediaTypeObjectSchema = module.Import('MediaTypeObject');
export const HeaderObjectSchema = module.Import('HeaderObject');
export const ServerObjectSchema = module.Import('ServerObject');
export const ExternalDocumentationObjectSchema = module.Import('ExternalDocumentationObject');
export const InfoObjectSchema = module.Import('InfoObject');
export const ContactObjectSchema = module.Import('ContactObject');
export const LicenseObjectSchema = module.Import('LicenseObject');
export const ResponseObjectSchema = module.Import('ResponseObject');
export const ResponsesObjectSchema = module.Import('ResponsesObject');
export const ParameterObjectSchema = module.Import('ParameterObject');
export const ExampleObjectSchema = module.Import('ExampleObject');
export const RequestBodyObjectSchema = module.Import('RequestBodyObject');
export const SecuritySchemesSchema = module.Import('SecuritySchemes');
export const SecuritySchemeObjectSchema = module.Import('SecuritySchemeObject');
export const LinkObjectSchema = module.Import('LinkObject');
export const XMLObjectSchema = module.Import('XMLObject');
export const DiscriminatorObjectSchema = module.Import('DiscriminatorObject');
export const OAuthFlowsObjectSchema = module.Import('OAuthFlowsObject');
export const ServerVariableObjectSchema = module.Import('ServerVariableObject');
export const TraversedDescriptionSchema = module.Import('TraversedDescriptionObject');
export const TraversedEntrySchema = module.Import('TraversedEntryObject');
export const TraversedTagSchema = module.Import('TraversedTagObject');
export const TraversedOperationSchema = module.Import('TraversedOperationObject');
export const TraversedSchemaSchema = module.Import('TraversedSchemaObject');
export const TraversedWebhookSchema = module.Import('TraversedWebhookObject');
