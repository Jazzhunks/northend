import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { waAPI } from "@/lib/api";
import { useBroadcastUpload } from "@/hooks/useBroadcastUpload";
import { useWAAnalyticsStream } from "@/lib/waAnalyticsStream";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Plus,
  Send,
  Upload,
  Play,
  BarChart3,
  FileSpreadsheet,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LayoutTemplate,
} from "lucide-react";
import TemplateMapper from "@/components/wa/TemplateMapper";
import BroadcastProgress from "@/components/wa/BroadcastProgress";
import AnalyticsCharts from "@/components/wa/AnalyticsCharts";

const TABS = [
  { id: "campaigns", label: "Campaigns", icon: MessageSquare },
  { id: "new", label: "New Broadcast", icon: Plus },
  { id: "monitor", label: "Live Monitor", icon: Play },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
];

const TARGET_GROUPS = [
  { value: "leads", label: "CRM Leads" },
  { value: "students", label: "ERP Students" },
  { value: "applicants", label: "Scholarship Applicants" },
  { value: "external", label: "External Upload Only" },
  { value: "all", label: "All CRM Segments" },
];

const EMPTY_CAMPAIGN = {
  name: "",
  template_name: "",
  template_language: "en_US",
  template_components: null,
  target_group: "leads",
  branch_id: "",
  variable_defaults: {},
  variable_mappings: {},
  external_contact_job_id: null,
};

export default function ErpWhatsApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [excelColumns, setExcelColumns] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [form, setForm] = useState(EMPTY_CAMPAIGN);
  const [loading, setLoading] = useState(false);
  const [monitorJobId, setMonitorJobId] = useState(null);
  const [monitorJobStatus, setMonitorJobStatus] = useState(null);
  const [analyticsCampaignId, setAnalyticsCampaignId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const { upload: uploadContacts, uploading: uploadingContacts } = useBroadcastUpload();

  const refreshCampaigns = async () => {
    try {
      const { data } = await waAPI.listCampaigns();
      setCampaigns(data || []);
    } catch (e) {
      // silent
    }
  };

  const refreshTemplates = async () => {
    try {
      const { data } = await waAPI.listTemplates();
      setTemplates(data.data || []);
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    refreshCampaigns();
    refreshTemplates();
  }, []);

  const handleTemplateChange = async (name) => {
    setSelectedTemplate(name);
    setForm((f) => ({ ...f, template_name: name, template_components: null }));
    setUploadResult(null);
    setExcelColumns([]);
    setPreviewRows([]);
  };

  const handleFileUpload = async (file) => {
    const result = await uploadContacts(file);
    setUploadResult(result);
    if (result?.contacts_imported > 0) {
      setForm((f) => ({ ...f, external_contact_job_id: result.job_id }));
    }
    return result;
  };

  const handleCreateCampaign = async () => {
    if (!form.template_name && !form.template_components) {
      toast.error("Please select a template");
      return;
    }
    if (form.target_group === "external" && !form.external_contact_job_id) {
      toast.error("Please upload an Excel file for external targeting");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        variable_mappings: form.variable_mappings || {},
        variable_defaults: form.variable_defaults || {},
      };
      const { data } = await waAPI.createCampaign(payload);
      setForm((f) => ({ ...f, ...EMPTY_CAMPAIGN, template_components: f.template_components }));
      setSelectedTemplate(null);
      setUploadResult(null);
      setExcelColumns([]);
      setPreviewRows([]);
      toast.success("Campaign created");
      setActiveTab("campaigns");
      refreshCampaigns();
    } catch (e) {
      toast.error(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const { data } = await waAPI.sendCampaign(campaignId);
      toast.success("Broadcast started");
      setMonitorJobId(data.job_id);
      setActiveTab("monitor");
    } catch (e) {
      toast.error(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalytics = async (campaignId) => {
    setAnalyticsCampaignId(campaignId);
    setActiveTab("analytics");
    try {
      const { data } = await waAPI.getCampaignAnalytics(campaignId);
      setAnalytics(data);
    } catch (e) {
      toast.error("Failed to load analytics");
    }
  };

  const handleJobEvent = (event) => {
    if (event.type === "job_update" || event.type === "job_complete") {
      setMonitorJobStatus(event.data);
    }
  };

  useWAAnalyticsStream(monitorJobId, handleJobEvent);

  useEffect(() => {
    if (monitorJobId && !monitorJobStatus) {
      const interval = setInterval(async () => {
        try {
          const { data } = await waAPI.getCampaign(monitorJobId);
          if (data?.latest_job) {
            setMonitorJobStatus(data.latest_job);
          }
        } catch (e) {
          // ignore
        }
      }, 2000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitorJobId]);

  useEffect(() => {
    if (analyticsCampaignId && !analytics) {
      const interval = setInterval(async () => {
        try {
          const { data } = await waAPI.getCampaignAnalytics(analyticsCampaignId);
          setAnalytics(data);
        } catch (e) {
          // ignore
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [analyticsCampaignId, analytics]);

  const selectedTemplateData = useMemo(
    () => templates.find((t) => t.name === selectedTemplate),
    [templates, selectedTemplate]
  );

  const templateVariables = useMemo(() => {
    if (!selectedTemplateData?.components) return [];
    const vars = [];
    const seen = new Set();
    for (const comp of selectedTemplateData.components || []) {
      if (comp.type !== "BODY") continue;
      const text = comp.text || "";
      for (const m of text.matchAll(/\{\{(\d+)\}\}/g)) {
        const idx = m[1];
        if (seen.has(idx)) continue;
        seen.add(idx);
        vars.push({ index: idx });
      }
    }
    return vars.sort((a, b) => Number(a.index) - Number(b.index));
  }, [selectedTemplateData]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            WhatsApp <span className="text-accent font-medium italic">Broadcast.</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Design, deploy, and monitor template-driven broadcasts across CRM and external lists.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-accent text-accent-foreground border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "campaigns" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-display font-medium text-lg text-foreground">Active Campaigns</h3>
            <Button size="sm" onClick={() => setActiveTab("new")} className="rounded-xl text-xs font-bold cursor-pointer">
              <Plus size={14} className="mr-1.5" /> New Campaign
            </Button>
          </div>
          {campaigns.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground rounded-2xl border border-border">
              No campaigns yet. Create your first broadcast to get started.
            </Card>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <Card key={c.id} className="p-4 rounded-2xl border border-border bg-background/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-foreground text-sm sm:text-base truncate">{c.name || c.template_name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Template: <span className="font-mono">{c.template_name}</span> · Status:{" "}
                        <span className="uppercase tracking-wider font-bold">{c.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Target: {c.target_group} {c.branch_id ? `· Branch: ${c.branch_id}` : ""}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewAnalytics(c.id)}
                        className="rounded-xl text-xs cursor-pointer"
                      >
                        <BarChart3 size={14} className="mr-1.5" /> Analytics
                      </Button>
                      {c.status !== "processing" && c.status !== "completed" && (
                        <Button
                          size="sm"
                          onClick={() => handleSendCampaign(c.id)}
                          disabled={loading}
                          className="rounded-xl text-xs font-bold bg-[#25D366] text-black hover:brightness-110 cursor-pointer"
                        >
                          <Send size={14} className="mr-1.5" /> Send
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "new" && (
        <div className="space-y-6 animate-fadeIn">
          <Card className="p-5 rounded-2xl border border-border bg-background/30 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider font-bold">Campaign Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. October Lead Blast"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider font-bold">Template</Label>
                <Select value={form.template_name} onValueChange={handleTemplateChange}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select approved template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.name} value={t.name}>
                        {t.name} ({t.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider font-bold">Target Group</Label>
                <Select
                  value={form.target_group}
                  onValueChange={(val) => setForm((f) => ({ ...f, target_group: val }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_GROUPS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider font-bold">Branch (optional)</Label>
                <Input
                  value={form.branch_id}
                  onChange={(e) => setForm((f) => ({ ...f, branch_id: e.target.value }))}
                  placeholder="Branch ID"
                  className="rounded-xl"
                />
              </div>
            </div>

            {form.target_group === "external" && (
              <div className="space-y-3 p-4 rounded-2xl border border-dashed border-border bg-muted/20">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Upload size={16} /> External Contact Upload
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an Excel/CSV file with at least a phone column. Duplicates within the file will be
                  skipped with a warning. Numbers already in the database will still receive this broadcast.
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={uploadingContacts}
                  className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
                />
                {uploadResult && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Imported: {uploadResult.contacts_imported} contacts</div>
                    {uploadResult.warnings?.length > 0 && (
                      <div className="text-amber-600">Warnings: {uploadResult.warnings.length}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedTemplateData && (
              <div className="space-y-3 p-4 rounded-2xl border border-border bg-background/20">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Template size={16} /> Variable Mapping
                </div>
                <TemplateMapper
                  templateName={selectedTemplate}
                  templateComponents={selectedTemplateData.components}
                  excelColumns={excelColumns}
                  variableMappings={form.variable_mappings}
                  onMappingsChange={(m) => setForm((f) => ({ ...f, variable_mappings: m }))}
                  variableDefaults={form.variable_defaults}
                  onDefaultsChange={(d) => setForm((f) => ({ ...f, variable_defaults: d }))}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleCreateCampaign}
                disabled={loading}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Plus size={14} className="mr-2" />}
                Create Campaign
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "monitor" && (
        <div className="space-y-4 animate-fadeIn">
          {!monitorJobId ? (
            <Card className="p-8 text-center text-muted-foreground rounded-2xl border border-border">
              Start a broadcast from the Campaigns tab to see live progress here.
            </Card>
          ) : (
            <BroadcastProgress jobStatus={monitorJobStatus} />
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Label className="text-xs uppercase tracking-wider font-bold">Select Campaign</Label>
            <Select value={analyticsCampaignId || ""} onValueChange={handleViewAnalytics}>
              <SelectTrigger className="rounded-xl w-64">
                <SelectValue placeholder="Choose campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name || c.template_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => setAnalytics(null)} className="rounded-xl text-xs cursor-pointer">
              <RefreshCw size={14} className="mr-1.5" /> Refresh
            </Button>
          </div>
          {analytics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-4 rounded-2xl border border-border bg-background/40">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total</div>
                  <div className="text-2xl font-bold">{analytics.total_messages || 0}</div>
                </Card>
                <Card className="p-4 rounded-2xl border border-border bg-background/40">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Delivered</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {analytics.by_status?.delivered || 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{analytics.delivery_rate}%</div>
                </Card>
                <Card className="p-4 rounded-2xl border border-border bg-background/40">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Read</div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.by_status?.read || 0}</div>
                  <div className="text-[10px] text-muted-foreground">{analytics.read_rate}%</div>
                </Card>
                <Card className="p-4 rounded-2xl border border-border bg-background/40">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Failed</div>
                  <div className="text-2xl font-bold text-rose-600">{analytics.by_status?.failed || 0}</div>
                  <div className="text-[10px] text-muted-foreground">{analytics.fail_rate}%</div>
                </Card>
              </div>
              <AnalyticsCharts analytics={analytics} />
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground rounded-2xl border border-border">
              Select a campaign to view analytics.
            </Card>
          )}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-medium text-lg text-foreground">Approved Meta Templates</h3>
            <Button size="sm" variant="outline" onClick={refreshTemplates} className="rounded-xl text-xs cursor-pointer">
              <RefreshCw size={14} className="mr-1.5" /> Refresh
            </Button>
          </div>
          {templates.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground rounded-2xl border border-border">
              No approved templates found. Submit templates via Meta Business Manager first.
            </Card>
          ) : (
            <div className="space-y-3">
              {templates.map((t) => (
                <Card key={t.name} className="p-4 rounded-2xl border border-border bg-background/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-foreground text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Language: {t.language} · Category: {t.category}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(t.name);
                        setActiveTab("new");
                      }}
                      className="rounded-xl text-xs cursor-pointer"
                    >
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
