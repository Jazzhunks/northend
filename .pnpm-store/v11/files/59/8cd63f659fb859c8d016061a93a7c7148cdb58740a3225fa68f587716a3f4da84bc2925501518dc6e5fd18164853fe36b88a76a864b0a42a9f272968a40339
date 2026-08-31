import type { UnknownObject } from '@scalar/types/utils';
/**
 * Upgrade an AsyncAPI 3.0 document to 3.1.0.
 *
 * 3.1 is a clarification release — the only real schema rule it tightens is that operation
 * `messages` $refs MUST use the channel-scoped form (`#/channels/{id}/messages/{name}`). The 3.0
 * spec's own examples used the components-scoped form, so many real-world 3.0 documents do too.
 * We canonicalize on upgrade and pull the referenced message into the channel's `messages` map if
 * it isn't already there.
 */
export declare function upgradeFromThreeToThreeOne(originalDocument: UnknownObject): UnknownObject;
//# sourceMappingURL=upgrade-from-three-to-three-one.d.ts.map