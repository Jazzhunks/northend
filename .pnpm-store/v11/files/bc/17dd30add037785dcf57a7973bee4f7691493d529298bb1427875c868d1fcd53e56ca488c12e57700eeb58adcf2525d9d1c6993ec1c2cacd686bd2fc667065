/**
 * WebSocket session abstraction for the AsyncAPI channel operation transport.
 *
 * Manages the lifecycle of a single WebSocket connection: connect, send, close.
 * The session tracks connection state transitions and bidirectional message frames,
 * emitting callbacks so the UI can render a live message log.
 *
 * Browser WebSocket does not support custom headers on the handshake request.
 * Auth is applied via query parameters or Sec-WebSocket-Protocol where applicable.
 * In Electron, a richer handshake path may be used in the future.
 */
export type WebSocketSessionState = 'idle' | 'connecting' | 'open' | 'closing' | 'closed' | 'error';
export type WebSocketFrameOpcode = 'text' | 'binary' | 'close';
export type WebSocketFrame = {
    direction: 'incoming' | 'outgoing';
    timestamp: number;
    data: string | ArrayBuffer;
    opcode: WebSocketFrameOpcode;
};
export type WebSocketCloseInfo = {
    code: number;
    reason: string;
    wasClean: boolean;
};
export type WebSocketSessionCallbacks = {
    onFrame?: (frame: WebSocketFrame) => void;
    onStateChange?: (state: WebSocketSessionState, previous: WebSocketSessionState) => void;
    onError?: (event: Event) => void;
    onClose?: (info: WebSocketCloseInfo) => void;
    onOpen?: () => void;
};
export type WebSocketConnectOptions = {
    url: string;
    protocols?: string | string[];
    callbacks?: WebSocketSessionCallbacks;
    /** Injectable WebSocket constructor for testing or Electron override */
    customWebSocket?: typeof WebSocket;
};
export type WebSocketSession = {
    readonly state: WebSocketSessionState;
    readonly frames: WebSocketFrame[];
    readonly closeInfo: WebSocketCloseInfo | null;
    readonly url: string | null;
    connect: (options: WebSocketConnectOptions) => void;
    send: (data: string) => void;
    close: (code?: number, reason?: string) => void;
    clearFrames: () => void;
    destroy: () => void;
};
/**
 * Creates a new WebSocket session with lifecycle management.
 *
 * The session starts in `idle` state and transitions through `connecting` -> `open`
 * on success, or `connecting` -> `error` on failure. Calling `close()` transitions
 * through `closing` -> `closed`. Frames are accumulated in the session for the UI
 * message log.
 */
export declare const createWebSocketSession: () => WebSocketSession;
//# sourceMappingURL=websocket-session.d.ts.map