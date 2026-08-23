import { useEffect, useMemo, useRef, useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Send, MessageCircle, Search, User, Phone, GraduationCap,
  RefreshCw, FileText, Paperclip, X, Check, CheckCheck, ChevronLeft,
} from "lucide-react";

const ONE_MIN = 60 * 1000;

export default function WhatsAppInbox() {
  const [threads, setThreads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(true);

  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const { data } = await api.get("/whatsapp/threads?limit=100");
      setThreads(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to load conversations");
    } finally { setLoadingThreads(false); }
  };

  useEffect(() => {
    loadThreads();
    const iv = setInterval(loadThreads, ONE_MIN);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return threads;
    const q = query.trim().toLowerCase();
    return threads.filter(t =>
      (t.profile_name || "").toLowerCase().includes(q) ||
      (t.wa_id || "").includes(q) ||
      (t.linked_application_no || "").includes(q) ||
      (t.linked_name || "").toLowerCase().includes(q)
    );
  }, [threads, query]);

  const selected = threads.find(t => t.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 h-[calc(100vh-14rem)] min-h-[520px] border border-white/10 rounded-2xl overflow-hidden bg-background/40" data-testid="wa-inbox">
      {/* Threads list */}
      <div className={`${!showList && selectedId ? "hidden lg:flex" : "flex"} flex-col border-r border-white/10 bg-background/60`}>
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-[#25D366]"/>
            <div className="text-sm font-medium">Conversations</div>
            <button onClick={loadThreads} className="ml-auto p-1.5 rounded-lg hover:bg-white/5" data-testid="wa-refresh">
              <RefreshCw size={13} className={loadingThreads ? "animate-spin" : ""}/>
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search name, phone, app no…"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/40"
              data-testid="wa-search"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingThreads && filtered.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">Loading…</div>
          )}
          {!loadingThreads && filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <MessageCircle size={28} className="mx-auto mb-3 opacity-30"/>
              <div className="font-medium mb-1">No conversations yet</div>
              <div className="opacity-70">Incoming WhatsApp messages will appear here.</div>
            </div>
          )}
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedId(t.id); setShowList(false); }}
              className={`w-full text-left px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.03] transition ${selectedId === t.id ? "bg-white/[0.05]" : ""}`}
              data-testid={`wa-thread-${t.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[#25D366]/15 grid place-items-center flex-shrink-0">
                  <User size={16} className="text-[#25D366]"/>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium truncate">{t.profile_name || t.linked_name || t.wa_id}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0">{fmtTime(t.last_message_at)}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <div className="text-xs text-muted-foreground truncate">{t.last_message_preview || "—"}</div>
                    {t.unread_count > 0 && (
                      <span className="text-[10px] font-bold text-black bg-[#25D366] rounded-full px-2 py-0.5 shrink-0" data-testid={`wa-unread-${t.id}`}>{t.unread_count}</span>
                    )}
                  </div>
                  {t.linked_application_no && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-accent">
                      <GraduationCap size={10}/>App No <span className="font-mono font-bold">{t.linked_application_no}</span>
                      {t.linked_scholarship_title && <span className="text-muted-foreground">· {t.linked_scholarship_title}</span>}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat pane */}
      <div className={`${showList && !selectedId ? "hidden lg:flex" : "flex"} flex-col bg-background/40`}>
        {!selected ? (
          <div className="flex-1 grid place-items-center text-center p-8 text-muted-foreground">
            <div>
              <MessageCircle size={40} className="mx-auto mb-3 opacity-30"/>
              <div className="text-sm">Select a conversation to view messages</div>
            </div>
          </div>
        ) : (
          <ChatPane
            key={selected.id}
            thread={selected}
            onBack={() => { setShowList(true); setSelectedId(null); }}
            onSent={() => loadThreads()}
          />
        )}
      </div>
    </div>
  );
}

function ChatPane({ thread, onBack, onSent }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showTpl, setShowTpl] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const scrollRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/whatsapp/threads/${thread.id}/messages?limit=200`);
      setMessages(data.items || []);
      setContact(data.contact || null);
      // mark read (best-effort)
      api.patch(`/whatsapp/threads/${thread.id}/read`).catch(() => {});
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to load messages");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [thread.id]);
  useEffect(() => {
    // auto-scroll to bottom on new messages
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const sendText = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post(`/whatsapp/threads/${thread.id}/messages`, { kind: "text", text: text.trim() });
      setText("");
      await load();
      onSent?.();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to send");
    } finally { setSending(false); }
  };

  const sendTemplate = async (name, language, components) => {
    setSending(true);
    try {
      await api.post(`/whatsapp/threads/${thread.id}/messages`, {
        kind: "template", template_name: name, template_language: language || "en_US",
        template_components: components || [],
      });
      toast.success(`Template "${name}" sent`);
      setShowTpl(false);
      await load(); onSent?.();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to send template");
    } finally { setSending(false); }
  };

  const sendMedia = async ({ kind, url, caption, filename }) => {
    setSending(true);
    try {
      await api.post(`/whatsapp/threads/${thread.id}/messages`, {
        kind, media_url: url, caption, filename,
      });
      toast.success(`${kind} sent`);
      setShowMedia(false);
      await load(); onSent?.();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to send media");
    } finally { setSending(false); }
  };

  return (
    <>
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-white/10 bg-background/70 flex items-center gap-3">
        <button onClick={onBack} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5" data-testid="wa-back-btn">
          <ChevronLeft size={16}/>
        </button>
        <div className="h-10 w-10 rounded-full bg-[#25D366]/15 grid place-items-center">
          <User size={16} className="text-[#25D366]"/>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate" data-testid="wa-chat-name">{thread.profile_name || thread.linked_name || thread.wa_id}</div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1"><Phone size={10}/>{thread.wa_id}</span>
            {thread.linked_application_no && (
              <span className="inline-flex items-center gap-1 text-accent"><GraduationCap size={10}/>App No <span className="font-mono font-bold">{thread.linked_application_no}</span></span>
            )}
          </div>
        </div>
        <button onClick={load} className="p-1.5 rounded-lg hover:bg-white/5" data-testid="wa-chat-refresh">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""}/>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(255,255,255,0.03)%22/></svg>')]">
        {loading && messages.length === 0 && <div className="text-center text-xs text-muted-foreground py-6">Loading messages…</div>}
        {!loading && messages.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">No messages yet in this conversation.</div>}
        {messages.map(m => <MessageBubble key={m.id} m={m}/>)}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-white/10 bg-background/70">
        <div className="flex items-end gap-2">
          <button onClick={() => setShowTpl(true)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground" title="Send template" data-testid="wa-tpl-btn">
            <FileText size={16}/>
          </button>
          <button onClick={() => setShowMedia(true)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground" title="Send media" data-testid="wa-media-btn">
            <Paperclip size={16}/>
          </button>
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } }}
            rows={1}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            className="flex-1 resize-none px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/40 max-h-32"
            data-testid="wa-text-input"
          />
          <button
            onClick={sendText}
            disabled={sending || !text.trim()}
            className="p-2.5 rounded-xl bg-[#25D366] text-black hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
            data-testid="wa-send-btn"
          >
            <Send size={16}/>
          </button>
        </div>
        <div className="text-[10px] text-muted-foreground mt-2 flex items-center justify-between">
          <span>{contact?.linked_application_no ? `Linked to WATH app #${contact.linked_application_no}` : "Not linked to any applicant"}</span>
          <span className="opacity-70">Free-form text works only within the 24-hour window · use templates otherwise</span>
        </div>
      </div>

      {showTpl && <TemplatePicker onClose={() => setShowTpl(false)} onSend={sendTemplate}/>}
      {showMedia && <MediaPicker onClose={() => setShowMedia(false)} onSend={sendMedia}/>}
    </>
  );
}

function MessageBubble({ m }) {
  const isOut = m.direction === "outbound";
  const text = m.text || m.caption || m.body?.text?.body || previewFromBody(m);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className={`flex ${isOut ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${isOut ? "bg-[#005c4b] text-white" : "bg-[#202c33] text-white"}`}>
        <div className="whitespace-pre-wrap break-words">{text || <em className="opacity-60">[{m.type}]</em>}</div>
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
          <span>{fmtTime(m.wa_timestamp)}</span>
          {isOut && <StatusTick status={m.status}/>}
        </div>
      </div>
    </motion.div>
  );
}

function StatusTick({ status }) {
  if (status === "read") return <CheckCheck size={12} className="text-[#53bdeb]"/>;
  if (status === "delivered") return <CheckCheck size={12}/>;
  if (status === "sent" || status === "accepted") return <Check size={12}/>;
  if (status === "failed") return <X size={12} className="text-rose-400"/>;
  return null;
}

function TemplatePicker({ onClose, onSend }) {
  const [tpls, setTpls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chosen, setChosen] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    api.get("/whatsapp/templates")
      .then(r => setTpls(r.data?.data || []))
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Could not load templates"))
      .finally(() => setLoading(false));
  }, []);

  const bodyComp = chosen?.components?.find(c => (c.type || "").toUpperCase() === "BODY");
  const varCount = (bodyComp?.text?.match(/\{\{\d+\}\}/g) || []).length;

  const submit = () => {
    const components = [];
    if (varCount > 0) {
      components.push({
        type: "body",
        parameters: Array.from({ length: varCount }, (_, i) => ({ type: "text", text: params[i + 1] || "" })),
      });
    }
    onSend(chosen.name, chosen.language, components);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-background border border-white/10 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()} data-testid="wa-tpl-modal">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-medium">Send Approved Template</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {loading && <div className="text-center text-xs text-muted-foreground py-6">Loading templates…</div>}
          {!loading && tpls.length === 0 && <div className="text-center text-xs text-muted-foreground py-6">No approved templates found in your WABA.</div>}
          {!chosen && tpls.map(t => (
            <button key={t.name} onClick={() => setChosen(t)} className="w-full text-left p-3 rounded-xl border border-white/10 hover:bg-white/[0.03] transition" data-testid={`wa-tpl-${t.name}`}>
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{t.language} · {t.category}</div>
            </button>
          ))}
          {chosen && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">{chosen.name} · {chosen.language}</div>
                <div className="text-sm whitespace-pre-wrap opacity-90">{bodyComp?.text || "[Body]"}</div>
              </div>
              {Array.from({ length: varCount }, (_, i) => (
                <input key={i}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40"
                  placeholder={`Variable {{${i + 1}}}`}
                  value={params[i + 1] || ""}
                  onChange={e => setParams(prev => ({ ...prev, [i + 1]: e.target.value }))}
                  data-testid={`wa-tpl-var-${i + 1}`}
                />
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setChosen(null)} className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider">Back</button>
                <button onClick={submit} className="flex-1 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider" data-testid="wa-tpl-send">Send</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaPicker({ onClose, onSend }) {
  const [kind, setKind] = useState("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [filename, setFilename] = useState("");

  const submit = () => {
    if (!url.trim()) { toast.error("Enter a public media URL"); return; }
    onSend({ kind, url: url.trim(), caption: caption.trim() || undefined, filename: filename.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-background border border-white/10 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()} data-testid="wa-media-modal">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-medium">Send Media</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {["image", "document", "video", "audio"].map(k => (
              <button key={k} onClick={() => setKind(k)} className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${kind === k ? "bg-accent text-accent-foreground" : "border border-white/10 text-muted-foreground"}`} data-testid={`wa-media-kind-${k}`}>{k}</button>
            ))}
          </div>
          <input value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" placeholder="Public HTTPS URL of the file" data-testid="wa-media-url"/>
          {kind !== "audio" && (
            <input value={caption} onChange={e => setCaption(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" placeholder="Caption (optional)" data-testid="wa-media-caption"/>
          )}
          {kind === "document" && (
            <input value={filename} onChange={e => setFilename(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" placeholder="Filename shown to recipient (optional)" data-testid="wa-media-filename"/>
          )}
          <button onClick={submit} className="w-full px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider" data-testid="wa-media-send">Send</button>
        </div>
      </div>
    </div>
  );
}

function fmtTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const diffDays = Math.floor((now - d) / (24 * 60 * 60 * 1000));
  if (diffDays < 7) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function previewFromBody(m) {
  if (!m?.body) return "";
  const b = m.body;
  if (b.image?.caption) return `📷 ${b.image.caption}`;
  if (b.document?.filename) return `📄 ${b.document.filename}`;
  if (b.template?.name) return `[Template] ${b.template.name}`;
  if (b.text?.body) return b.text.body;
  return "";
}
