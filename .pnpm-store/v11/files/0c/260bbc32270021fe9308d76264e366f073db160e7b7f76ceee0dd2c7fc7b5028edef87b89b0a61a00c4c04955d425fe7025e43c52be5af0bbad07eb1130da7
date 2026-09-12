import { Type } from '@scalar/typebox';
import { compose } from '../../schemas/compose.js';
import { WorkspaceMetaSchema } from '../../schemas/workspace.js';
import { InfoSchema } from '../../schemas/workspace-specification/info.js';
export const WorkspaceSpecificationSchema = compose(Type.Object({
    workspace: Type.Union([Type.Literal('draft')]),
    info: InfoSchema,
    documents: Type.Optional(Type.Record(Type.String(), Type.Object({
        $ref: Type.String(),
    }))),
    overrides: Type.Optional(Type.Record(Type.String(), Type.Any())),
}), WorkspaceMetaSchema);
