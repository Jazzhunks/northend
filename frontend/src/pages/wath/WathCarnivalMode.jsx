import WathRegistrationForm from "./WathRegistrationForm";
import {
  AboutSection,
  FormatSection,
  RewardsSection,
  SlabsSection,
  TimelineSection,
  AdmitCardDownloadSection,
  ResultCheckSection,
  FAQSection,
  FinalCTA
} from "./WathSharedSections";

export default function WathCarnivalMode({ carnival, mode, loading, onRegistered }) {
  return (
    <>
      <WathRegistrationForm
        campaign={null}
        carnival={carnival}
        mode={mode}
        loading={loading}
        onRegistered={onRegistered}
      />
      <AboutSection />
      <FormatSection />
      <RewardsSection />
      <SlabsSection />
      <TimelineSection campaign={null} carnival={carnival} mode={mode}/>
      <AdmitCardDownloadSection campaign={null} carnival={carnival}/>
      <ResultCheckSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
