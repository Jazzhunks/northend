import { Type } from '@scalar/typebox';
import { PathItemObjectRef } from './ref-definitions.js';
import { reference } from './reference.js';
export const CallbackObjectSchemaDefinition = Type.Record(Type.String(), 
/** A Path Item Object used to define a callback request and expected responses. A complete example is available. */
Type.Union([PathItemObjectRef, reference(PathItemObjectRef)]));
