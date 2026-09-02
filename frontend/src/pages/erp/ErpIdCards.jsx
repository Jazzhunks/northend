import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { Printer, Search, CheckSquare, Square, Contact2 } from "lucide-react";

export default function ErpIdCards() {
  const { erpUser } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Safe callback mapping for branch directories fetching
  const loadBranches = useCallback(() => {
    erp.listBranches().then(setBranches).catch(() => {});
  }, []);

  // Safe callback mapping for student directory pulling parameters
  const loadStudentDirectory = useCallback(() => {
    const params = branchId ? { branch_id: branchId } : {};
    erp.listStudents(params)
      .then(setStudents)
      .catch(e => toast.error(formatError(e) || "Failed to load enrollment directories"));
  }, [branchId]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    loadStudentDirectory();
  }, [loadStudentDirectory]);

  // Client-side quick index filtering
  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.batch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      filteredStudents.forEach(s => next.add(s.id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handlePrintAction = () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one student record to compile card templates");
      return;
    }
    window.print();
  };

  const studentsToPrint = students.filter(s => selectedIds.has(s.id));

  // Chunk items into rows of exactly 5 for Landscape A4 configuration mapping control
  const chunkedStudentsForPrint = [];
  for (let i = 0; i < studentsToPrint.length; i += 5) {
    chunkedStudentsForPrint.push(studentsToPrint.slice(i, i + 5));
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn relative">
      
      {/* --- PRECISE PRINT CANVAS STYLE DECLARATIONS LAYER --- */}
      <style>{`
        @media screen {
          .print-sheet-canvas-portal { display: none !important; }
        }

        @media print {
          .screen-only, aside, header, nav, button, input, select, .toast {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          
          body, html, #root {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-sheet-canvas-portal {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important; /* Forces layout to lock inside Landscape A4 boundaries */
            padding: 10mm !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
          }

          .print-row-strip {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            page-break-inside: avoid !important;
            margin-bottom: 15mm !important;
          }

          .id-card-frame-vertical {
            width: 54mm !important; /* Perfectly drops 5 cards side-by-side cleanly across landscape A4 printable space */
            height: 160mm !important;
            border: 0.25mm dashed #3f3f46 !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            position: relative !important;
            background: #ffffff !important;
          }

          .card-half-panel {
            height: 80mm !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            position: relative !important;
            box-sizing: border-box !important;
          }

          /* Inverted Fold Panel Setup matching requested orientation */
          .back-side-inverted {
            transform: rotate(180deg) !important;
            border-top: 0.25mm dashed #a1a1aa !important;
          }

          .brand-blue-header {
            width: 100% !important;
            background-color: #3b82f6 !important;
            color: #ffffff !important;
            text-align: center !important;
            padding: 4mm 2mm !important;
            box-sizing: border-box !important;
          }

          .student-avatar-circle {
            width: 28mm !important;
            height: 28mm !important;
            border-radius: 50% !important;
            border: 1mm solid #ffffff !important;
            overflow: hidden !important;
            margin-top: -6mm !important;
            background: #e4e4e7 !important;
            z-index: 10 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .print-qr-matrix-box {
            width: 38mm !important;
            height: 38mm !important;
            margin-top: 4mm !important;
            background: #ffffff !important;
            border: 0.3mm solid #000000 !important;
            padding: 1.5mm !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* DASHBOARD SCREEN OPERATIONS BAR (HIDDEN ON PRINT) */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0 screen-only">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Credential Production Deck</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">ID Card Matrix</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Batch-select student profiles. The printing pipeline bundles them into rows of 5 cards per sequence line automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button onClick={clearSelection} className="px-3 py-2 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground transition bg-background/30">
              Clear Choice ({selectedIds.size})
            </button>
          )}
          <button onClick={handlePrintAction} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition">
            <Printer size={14}/> Generate &amp; Print Cards
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER SEGMENTS (HIDDEN ON PRINT) */}
      <div className="flex gap-3 flex-wrap shrink-0 screen-only">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search roster fields by name, registration code, or batch..." 
            className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
          />
        </div>
        {isSuper(erpUser) && (
          <select 
            value={branchId} 
            onChange={e => setBranchId(e.target.value)} 
            className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground"
          >
            <option value="">All enterprise branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <button onClick={selectAllFiltered} className="px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted/50 transition text-foreground">
          Select All Filtered
        </button>
      </div>

      {/* MAIN SCREEN CONTROL DIRECTORY DIRECT GRID */}
      <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col flex-1 min-h-0 screen-only">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[750px]">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[6%] px-5 py-3.5 text-center bg-muted"></th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Student No</th>
                <th className="w-[25%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Learner Profile Name</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Class Batch Allocation</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Contact Line</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Parent Mobile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background/20">
              {filteredStudents.map(s => {
                const isChecked = selectedIds.has(s.id);
                return (
                  <tr 
                    key={s.id} 
                    onClick={() => toggleSelect(s.id)}
                    className={`cursor-pointer transition-colors ${isChecked ? "bg-accent/5 hover:bg-accent/10" : "hover:bg-muted/50"}`}
                  >
                    <td className="px-5 py-4 text-center">
                      <div className="text-accent flex justify-center items-center">
                        {isChecked ? <CheckSquare size={16} className="text-primary"/> : <Square size={16} className="text-muted-foreground/30"/>}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold tracking-wide">{s.student_no}</td>
                    <td className="px-5 py-4 text-xs font-bold text-foreground truncate">{s.full_name}</td>
                    <td className="px-5 py-4 text-xs text-foreground font-medium truncate">{s.batch || "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{s.contact_phone}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground/60 whitespace-nowrap">{s.parent_phone || "—"}</td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No active student directories discovered matching selection queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================================
          DYNAMIC PRINT SECURING STAGE GRID (EXECUTES EXCLUSIVELY ON PHYSICAL PRINT RUNS)
          ============================================================================ */}
      <div className="print-sheet-canvas-portal">
        {chunkedStudentsForPrint.map((rowGroup, rowIdx) => (
          <div key={rowIdx} className="print-row-strip">
            {rowGroup.map((student) => {
              const localBranchName = branches.find(b => b.id === student.branch_id)?.name || "PARRAYPORA";
              
              return (
                <div key={student.id} className="id-card-frame-vertical" style={{ fontFamily: "sans-serif" }}>
                  
                  {/* --- CARD FACE: FRONT SIDE TOP PANEL LAYER --- */}
                  <div className="card-half-panel">
                    <div className="brand-blue-header">
                      <div style={{ fontSize: "11pt", fontWeight: "900", letterSpacing: "0.02em" }}>unacademy</div>
                      <div style={{ fontSize: "6.5pt", fontWeight: "700", opacity: 0.9, marginTop: "2px", letterSpacing: "0.05em" }}>Session : 2026 - 27</div>
                    </div>
                    
                    {/* Circle Image Wrapper Layout Context */}
                    <div className="student-avatar-circle">
                      {student.avatar_url ? (
                        <img src={student.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Contact2 size={36} className="text-zinc-400" />
                      )}
                    </div>

                    {/* Metadata Typography String Controls */}
                    <div style={{ textAlign: "center", marginTop: "4px", padding: "0 2mm", width: "100%", boxSizing: "border-box" }}>
                      <div style={{ fontSize: "11.5pt", fontWeight: "900", color: "#000000", textTransform: "uppercase", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {student.full_name}
                      </div>
                      <div style={{ fontSize: "8.5pt", fontWeight: "700", color: "#27272a", marginTop: "2px", textTransform: "uppercase" }}>
                        {student.batch || "CONQUER NEET"}
                      </div>
                      {student.student_no && (
                        <div style={{ fontSize: "7.5pt", fontFamily: "monospace", color: "#71717a", fontWeight: "700", marginTop: "3px" }}>
                          {student.student_no}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- CARD FACE: BACK SIDE BOTTOM PANEL LAYER (INVERTED ROTATION MECHANISM) --- */}
                  <div className="card-half-panel back-side-inverted">
                    <div className="brand-blue-header" style={{ padding: "3mm 2mm" }}>
                      <div style={{ fontSize: "8.5pt", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.04em" }}>UNACADEMY CENTRE</div>
                      <div style={{ fontSize: "6.5pt", fontWeight: "600", opacity: 0.9, marginTop: "1px", letterSpacing: "0.06em" }}>{localBranchName.toUpperCase()}</div>
                    </div>

                    {/* Fluid Ribbon Alignment Accent */}
                    <div style={{ width: "8mm", height: "5mm", background: "#ffffff", borderRadius: "0 0 4mm 4mm", display: "flex", alignItems: "center", justifyContent: "center", border: "0.2mm solid #e4e4e7", borderTop: "none" }}>
                      <div style={{ width: "3mm", height: "3mm", borderRadius: "50%", background: "#3b82f6" }} />
                    </div>

                    {/* High-Contrast Accurate Matrix Array for Scanner Terminals */}
                    <div className="print-qr-matrix-box">
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1px", width: "100%", height: "100%", background: "#000000" }}>
                        {[...Array(36)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              background: (
                                i < 6 || i % 6 === 0 || i % 6 === 5 || i > 29 || 
                                (i > 7 && i < 10) || (i > 13 && i < 16) || 
                                i === 20 || i === 22 || i === 27
                              ) ? "#000000" : "#ffffff" 
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}