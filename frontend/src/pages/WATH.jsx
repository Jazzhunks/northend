import { useWathPage } from "@/hooks/useWathPage";
import WathDisabledMode from "./wath/WathDisabledMode";
import WathExamMode from "./wath/WathExamMode";
import WathCarnivalMode from "./wath/WathCarnivalMode";

export default function WATH() {
  const { pageState, loading, load } = useWathPage();

  const mode = pageState?.mode || "exam";
  const campaign = mode === "exam" ? pageState?.exam : null;
  const carnival = mode === "carnival" ? pageState?.carnival : null;

  if (loading || !pageState) {
    return (
      <div className="min-h-screen grid place-items-center bg-background" data-testid="wath-loading">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-accent/20"/>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin"/>
            <div className="absolute inset-3 rounded-full bg-accent/10 blur-md animate-pulse"/>
          </div>
          <div className="mt-6 text-[10px] uppercase tracking-[0.32em] text-accent font-bold">Loading</div>
          <div className="mt-1 text-xs text-muted-foreground">Preparing your WATH experience…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="wath-page" data-mode={mode}>
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {mode === "disabled" ? (
        <WathDisabledMode message={pageState?.disabled_message}/>
      ) : mode === "carnival" ? (
        <WathCarnivalMode
          carnival={carnival}
          mode={mode}
          loading={loading}
          onRegistered={() => load(true)}
        />
      ) : (
        <WathExamMode
          campaign={campaign}
          mode={mode}
          loading={loading}
          onRegistered={() => load(true)}
        />
      )}
    </div>
  );
}
