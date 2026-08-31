import { Type } from '@scalar/typebox';
import { compose } from '../../../schemas/compose.js';
import { XInternalSchema } from '../../../schemas/extensions/document/x-internal.js';
import { XScalarIgnoreSchema } from '../../../schemas/extensions/document/x-scalar-ignore.js';
import { XScalarOrderSchema } from '../../../schemas/extensions/general/x-scalar-order.js';
import { XDisplayNameSchema } from '../../../schemas/extensions/tag/x-display-name.js';
import { ExternalDocumentationObjectRef } from './ref-definitions.js';
/** Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances. */
export const TagObjectSchemaDefinition = compose(Type.Object({
    /** REQUIRED. The name of the tag. */
    name: Type.String(),
    /** A description for the tag. CommonMark syntax MAY be used for rich text representation. */
    description: Type.Optional(Type.String()),
    /** Additional external documentation for this tag. */
    externalDocs: Type.Optional(ExternalDocumentationObjectRef),
}), XDisplayNameSchema, XInternalSchema, XScalarIgnoreSchema, XScalarOrderSchema);
