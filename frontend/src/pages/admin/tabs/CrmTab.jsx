import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Search, UserCircle2, Mail, Phone, Calendar, ArrowRight, Activity, BookOpen, Trophy, Briefcase, MessageSquare } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function CrmTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-crm', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 3) return { results: [] };
      const res = await api.get('/admin/crm/search', { params: { q: debouncedSearch } });
      return res.data;
    },
    enabled: true
  });

  const getIconForType = (type) => {
    if (type === "Enrollment") return <BookOpen size={14} className="text-blue-500" />;
    if (type === "Scholarship App") return <Trophy size={14} className="text-amber-500" />;
    if (type === "Job App") return <Briefcase size={14} className="text-purple-500" />;
    if (type === "Inquiry") return <MessageSquare size={14} className="text-emerald-500" />;
    return <Activity size={14} />;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div>
          <h3 className="font-display font-medium text-2xl text-foreground flex items-center gap-2">
            <UserCircle2 className="text-accent" size={24} /> Unified CRM 
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Search for any student or lead across all platforms (name, phone, email).</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Type at least 3 characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:border-accent shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {!debouncedSearch || debouncedSearch.length < 3 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 glass border border-border rounded-3xl">
            <Search className="text-muted-foreground/30 mb-3" size={48} />
            <h4 className="font-medium text-foreground">Global Student Search</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Enter a name, email address, or phone number to instantly pull up a comprehensive 360-degree profile.</p>
          </div>
        ) : isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-rose-500">Failed to search CRM database.</div>
        ) : data?.results?.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No matching profiles found for "{debouncedSearch}".</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {data.results.map((person, idx) => (
              <div key={idx} className="glass border border-border rounded-3xl p-6 shadow-sm flex flex-col max-h-[500px]">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-6 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent font-display text-2xl uppercase border border-accent/20 shrink-0">
                    {person.name ? person.name.charAt(0) : "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-medium text-xl text-foreground truncate">{person.name || "Unknown Name"}</h4>
                    <div className="flex flex-col gap-1 mt-1.5">
                      {person.email && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail size={14} className="shrink-0" /> <span className="truncate">{person.email}</span>
                        </div>
                      )}
                      {person.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone size={14} className="shrink-0" /> <span className="font-mono">{person.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-center bg-muted/50 rounded-xl px-3 py-2 border border-border">
                    <div className="text-2xl font-bold text-foreground">{person.history.length}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Records</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                    {person.history.map((record, hIdx) => (
                      <div key={hIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-accent text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {getIconForType(record.type)}
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-background/50 border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-accent">{record.type}</div>
                            {record.date && (
                              <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                <Calendar size={10} /> {new Date(record.date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {/* Details based on type */}
                          {record.type === "Enrollment" && (
                            <div className="text-sm">Course: <span className="font-medium text-foreground">{record.details.course_id}</span> @ {record.details.center}</div>
                          )}
                          {record.type === "Scholarship App" && (
                            <div className="text-sm">
                              Campaign: <span className="font-medium text-foreground">{record.details.scholarship_id}</span>
                              <div className="text-xs mt-0.5 text-muted-foreground">Class: {record.details.standard} · Status: <span className="capitalize">{record.details.status}</span></div>
                            </div>
                          )}
                          {record.type === "Job App" && (
                            <div className="text-sm">Applied for: <span className="font-medium text-foreground">{record.details.job_id}</span></div>
                          )}
                          {record.type === "Inquiry" && (
                            <div className="text-sm">
                              Subject: <span className="font-medium text-foreground">{record.details.subject}</span>
                              <p className="text-xs mt-1 text-muted-foreground line-clamp-2 italic">"{record.details.message}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
