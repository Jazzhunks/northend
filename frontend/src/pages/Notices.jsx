import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pin } from "lucide-react";

export default function Notices() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/notices").then(r => setList(r.data)); }, []);
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16" data-testid="notices-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Notice Board</div>
      <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">Latest announcements.</h1>
      <div className="mt-10 space-y-3">
        {list.map(n => (
          <div key={n.id} className="border border-border p-6 rounded-md flex items-start gap-4 bg-background" data-testid={`notice-${n.id}`}>
            {n.pinned && <Pin size={16} className="text-accent mt-1"/>}
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary mb-1">{n.category}</div>
              <h3 className="font-display font-bold text-lg">{n.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{n.content}</p>
              <div className="text-xs text-muted-foreground mt-2 font-mono">{new Date(n.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
