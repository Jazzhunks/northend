import { useState, useMemo } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Terminal, X, UserPlus, Download, Loader2, FileSpreadsheet, UploadCloud, Printer, ClipboardList, Wand2, CheckCircle2, AlertCircle, Send } from "lucide-react";

const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper (JEE)", "Dropper (NEET)"];

const normalizeClass = (std, targetExam) => {
  if (!std) return "Unknown";
  const s = String(std).toLowerCase().replace(/[^a-z0-9]/g, '');
  const t = String(targetExam || "").toLowerCase().replace(/[^a-z0-9]/g, '');

  if (s.includes("drop") || s.includes("repeat") || s.includes("13")) {
    if (s.includes("jee") || t.includes("jee")) return "Dropper (JEE)";
    return "Dropper (NEET)"; 
  }
  
  if (s.includes("12") || s.includes("twel") || s === "xii" || s === "classxii") return "Class 12";
  if (s.includes("11") || s.includes("elev") || s === "xi" || s === "classxi") return "Class 11";
  if (s.includes("10") || s.includes("ten") || s === "x" || s === "classx") return "Class 10";
  if (s.includes("9") || s.includes("nin") || s === "ix" || s === "classix") return "Class 9";
  if (s.includes("8") || s.includes("eigh") || s === "viii" || s === "classviii") return "Class 8";
  if (s.includes("7") || s.includes("seven") || s === "vii" || s === "classvii") return "Class 7";
  
  return std;
};

const normalizeVenue = (rawVenue) => {
  if (!rawVenue) return "Unassigned";
  const vLower = String(rawVenue).trim().toLowerCase();
  let venue = String(rawVenue).trim();
  
  if (vLower === "90 ft" || vLower === "90ft" || vLower === "srinagar") {
    return "90 FT";
  } else if (vLower !== "unassigned") {
    return venue.charAt(0).toUpperCase() + venue.slice(1).toLowerCase();
  }
  return "Unassigned";
};

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

function CampaignOperationsModal({ 
  scholarshipId, 
  onClose, 
  onDownloadResultsTemplate, 
  onUploadResults, 
  onDownloadRegTemplate,
  onOpenBulkReg,
  onDownloadAttendance,
  allApps,
  onRefresh
}) {
  const [downloading, setDownloading] = useState(null); 
  const [viewTab, setViewTab] = useState("applicants"); 
  const [isCleaning, setIsCleaning] = useState(false);

  const campaignApps = useMemo(() => allApps.filter(a => a.scholarship_id === scholarshipId), [allApps, scholarshipId]);

  const logisticsData = useMemo(() => {
    const matrix = {};
    const classesSet = new Set(CLASSES);

    campaignApps.forEach(a => {
      const venue = normalizeVenue(a.venue || a.city || "Unassigned");
      const std = normalizeClass(a.standard || "Unknown", a.target_exam);
      
      classesSet.add(std);
      
      if (!matrix[venue]) matrix[venue] = {};
      if (!matrix[venue][std]) matrix[venue][std] = 0;
      matrix[venue][std]++;
    });

    return {
      matrix,
      classes: Array.from(classesSet).sort((a, b) => {
        const idxA = CLASSES.indexOf(a);
        const idxB = CLASSES.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      }),
      venues: Object.keys(matrix).sort()
    };
  }, [campaignApps]);

  const handleDownload = async (actionName, actionFn, ...args) => {
    setDownloading(actionName);
    try {
      await actionFn(...args);
    } finally {
      setDownloading(null);
    }
  };

  const handleCleanData = async () => {
    setIsCleaning(true);
    let updatedCount = 0;
    try {
      for (const app of campaignApps) {
        const currentStd = app.standard || "";
        const normalizedStd = normalizeClass(currentStd, app.target_exam);
        
        const currentVenue = app.venue || app.city || "Unassigned";
        const normalizedVenue = normalizeVenue(currentVenue);

        const updates = {};
        
        if (normalizedStd !== currentStd && CLASSES.includes(normalizedStd)) {
          updates.standard = normalizedStd;
        }
        
        if (normalizedVenue !== currentVenue && normalizedVenue !== "Unassigned") {
          updates.venue = normalizedVenue;
          updates.city = normalizedVenue;
        }

        if (Object.keys(updates).length > 0) {
          await api.put(`/scholarship-applications/${app.application_no}`, updates);
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        toast.success(`Successfully auto-formatted ${updatedCount} applicant records.`);
        if (onRefresh) onRefresh();
      } else {
        toast.info("All classes and venues are already uniformly formatted.");
      }
    } catch (error) {
      toast.error(formatError(error.response?.data?.detail) || "Error formatting data");
    } finally {
      setIsCleaning(false);
    }
  };

  if (!scholarshipId) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl glass-elevated border border-border bg-background p-6 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5 shrink-0">
          <h3 className="font-display font-medium text-xl text-foreground flex items-center gap-2">
            <Terminal className="text-accent" size={20} />
            Manage Campaign Operations
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
          <div className="glass p-5 rounded-2xl border border-border bg-background/30 flex flex-col items-center text-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500/50"></div>
            <UserPlus size={26} className="text-emerald-600 mb-1" />
            <div className="font-bold text-foreground text-sm">1. Bulk Registration</div>
            <div className="text-xs text-muted-foreground flex-1 mb-2">Register students and dispatch WhatsApp admit cards.</div>
            
            <Button 
              variant="outline" size="sm" 
              onClick={() => handleDownload("reg-temp", onDownloadRegTemplate, scholarshipId)} 
              disabled={downloading === "reg-temp"} 
              className="w-full text-xs rounded-xl border-border hover:bg-muted/50 cursor-pointer"
            >
              {downloading === "reg-temp" ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Download size={13} className="mr-1.5"/>} 
              Registration Template
            </Button>
            <Button 
              size="sm" 
              onClick={() => { onOpenBulkReg(scholarshipId); onClose(); }} 
              className="w-full text-xs font-bold rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer"
            >
              <Send size={13} className="mr-1.5"/> Upload & Dispatch
            </Button>
          </div>

          <div className="glass p-5 rounded-2xl border border-border bg-background/30 flex flex-col items-center text-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-accent/50"></div>
            <FileSpreadsheet size={26} className="text-accent mb-1" />
            <div className="font-bold text-foreground text-sm">2. Grade & Publish</div>
            <div className="text-xs text-muted-foreground flex-1 mb-2">Input offline exam scores to update student results.</div>
            
            <Button 
              variant="outline" size="sm" 
              onClick={() => handleDownload("res-temp", onDownloadResultsTemplate, scholarshipId)} 
              disabled={downloading === "res-temp"} 
              className="w-full text-xs rounded-xl border-border hover:bg-muted/50 cursor-pointer"
            >
              {downloading === "res-temp" ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Download size={13} className="mr-1.5"/>} 
              Scores Template
            </Button>
            
            <input
              type="file"
              accept=".xlsx"
              id="bulk-result-upload"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  onUploadResults(scholarshipId, f);
                  e.target.value = ""; 
                  onClose(); 
                }
              }}
            />
            <Button 
              size="sm" 
              onClick={() => document.getElementById("bulk-result-upload")?.click()} 
              className="w-full text-xs font-bold rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
            >
              <UploadCloud size={13} className="mr-1.5" /> Upload Scores
            </Button>
          </div>

          <div className="glass p-5 rounded-2xl border border-border bg-background/30 flex flex-col items-center text-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-400/50"></div>
            <Printer size={26} className="text-blue-400 mb-1" />
            <div className="font-bold text-foreground text-sm">3. Logistics & Reports</div>
            <div className="text-xs text-muted-foreground flex-1 mb-2">Export attendance logs and check print requirements.</div>
            
            <Button 
              variant="outline" size="sm" 
              onClick={() => handleDownload("att-rep", onDownloadAttendance, scholarshipId)} 
              disabled={downloading === "att-rep"} 
              className="w-full text-xs font-bold rounded-xl border-border hover:bg-muted/50 cursor-pointer"
            >
              {downloading === "att-rep" ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Download size={13} className="mr-1.5"/>} 
              Attendance Log
            </Button>
            <Button 
              size="sm" 
              onClick={() => setViewTab("logistics")} 
              className="w-full text-xs font-bold rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
            >
              <ClipboardList size={13} className="mr-1.5"/> Print Requirements
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-[250px] flex flex-col border border-border rounded-2xl bg-background/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-muted border-b border-border shrink-0 z-20">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewTab("applicants")} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${viewTab === "applicants" ? "bg-accent text-accent-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
              >
                Applicants ({campaignApps.length})
              </button>
              <button 
                onClick={() => setViewTab("logistics")} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${viewTab === "logistics" ? "bg-accent text-accent-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
              >
                Print & Logistics Matrix
              </button>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCleanData}
              disabled={isCleaning || campaignApps.length === 0}
              className="h-8 text-xs font-bold bg-muted/50 hover:bg-muted/50 border-border cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {isCleaning ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Wand2 size={13} className="mr-1.5"/>}
              Auto-Format Data
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {viewTab === "applicants" && (
              <table className="w-full text-sm text-left relative">
                <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider sticky top-0 z-10 shadow-[0_4px_20px_rgba(60,73,82,0.08)] border-b border-border">
                  <tr>
                    <th className="p-3 sm:p-4 whitespace-nowrap">App No</th>
                    <th className="p-3 sm:p-4 whitespace-nowrap">Applicant Name</th>
                    <th className="p-3 sm:p-4 whitespace-nowrap">School / Institute</th>
                    <th className="p-3 sm:p-4 whitespace-nowrap">Standard</th>
                    <th className="p-3 sm:p-4 text-center whitespace-nowrap">Score Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {campaignApps.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-muted-foreground italic bg-background/10">
                        No approved applicants found for this campaign yet.
                      </td>
                    </tr>
                  ) : (
                    campaignApps.map(a => (
                      <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-3 sm:p-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{a.application_no}</td>
                        <td className="p-3 sm:p-4 font-bold whitespace-nowrap">{a.name}</td>
                        <td className="p-3 sm:p-4 text-muted-foreground truncate max-w-[200px]" title={a.school || ""}>{a.school || "—"}</td>
                        <td className="p-3 sm:p-4 text-muted-foreground whitespace-nowrap">{a.standard || "—"}</td>
                        <td className="p-3 sm:p-4 text-center">
                          {a.result_published ? (
                            <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                              Published ({a.result_marks_obtained || 0})
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider bg-muted/50 border border-border text-muted-foreground px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {viewTab === "logistics" && (
              <div className="p-4 sm:p-6 animate-fadeIn">
                <div className="mb-4">
                  <h4 className="font-display font-medium text-lg text-foreground">Printing Requirements Matrix</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Use this breakdown to determine exact exam paper counts needed per class, per center.</p>
                </div>
                
                {campaignApps.length === 0 ? (
                  <EmptyState title="No Data Available" description="Register applicants to generate the logistics matrix." />
                ) : (
                  <div className="overflow-x-auto glass border border-border rounded-2xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                        <tr>
                          <th className="p-3 sm:p-4 whitespace-nowrap">Standard / Class</th>
                          {logisticsData.venues.map(v => (
                            <th key={v} className="p-3 sm:p-4 text-center whitespace-nowrap">{v}</th>
                          ))}
                          <th className="p-3 sm:p-4 text-center text-accent whitespace-nowrap">Total Print</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {logisticsData.classes.map(c => {
                          let rowTotal = 0;
                          return (
                            <tr key={c} className="hover:bg-muted/50">
                              <td className="p-3 sm:p-4 font-bold text-foreground whitespace-nowrap">{c}</td>
                              {logisticsData.venues.map(v => {
                                const count = logisticsData.matrix[v]?.[c] || 0;
                                rowTotal += count;
                                return (
                                  <td key={v} className="p-3 sm:p-4 text-center font-mono text-muted-foreground">
                                    {count > 0 ? count : "-"}
                                  </td>
                                );
                              })}
                              <td className="p-3 sm:p-4 text-center font-bold text-accent font-mono">{rowTotal}</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-muted border-t border-border">
                          <td className="p-3 sm:p-4 font-bold text-foreground whitespace-nowrap">VENUE TOTAL</td>
                          {logisticsData.venues.map(v => {
                            const vTotal = logisticsData.classes.reduce((sum, c) => sum + (logisticsData.matrix[v]?.[c] || 0), 0);
                            return <td key={v} className="p-3 sm:p-4 text-center font-bold text-emerald-600 font-mono">{vTotal}</td>;
                          })}
                          <td className="p-3 sm:p-4 text-center font-bold text-accent font-mono">{campaignApps.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignOperationsModal;
