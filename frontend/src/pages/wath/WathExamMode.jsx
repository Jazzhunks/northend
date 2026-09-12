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

export default function WathExamMode({ campaign, mode, loading, onRegistered }) {
  return (
    <>
      <WathRegistrationForm
        campaign={campaign}
        carnival={null}
        mode={mode}
        loading={loading}
        onRegistered={onRegistered}
      />
      <AboutSection />
      <FormatSection />
      <RewardsSection />
      <SlabsSection />
      <TimelineSection campaign={campaign} carnival={null} mode={mode}/>
      <AdmitCardDownloadSection campaign={campaign} carnival={null}/>
      <ResultCheckSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
