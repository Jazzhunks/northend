import { vi } from "vitest";
//#region src/v2/helpers/test-utils.ts
/** Creates a fresh mock event bus instance for testing */
var createMockEventBus = () => ({
	on: vi.fn(() => vi.fn()),
	once: vi.fn(() => vi.fn()),
	off: vi.fn(),
	onAny: vi.fn(() => vi.fn()),
	offAny: vi.fn(),
	emit: vi.fn(() => null),
	flushDebouncedEmits: vi.fn()
});
/** Mock event bus for all your testing needs */
var mockEventBus = createMockEventBus();
//#endregion
export { createMockEventBus, mockEventBus };

//# sourceMappingURL=test-utils.js.map