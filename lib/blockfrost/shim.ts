// Tiny noop shim so accidental imports don’t crash the build.
// Never reaches production bundle because nothing should import it.
export class BlockFrostAPI {
  constructor(_: unknown = {}) {}
}
