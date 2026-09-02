import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GlassPanel from "@/components/GlassPanel";
import { Eyebrow, Reveal, CTAPrimary } from "@/components/Cinematic";
import { 
  ShieldCheck, LockKey, Eye, Users, 
  Database, EnvelopeSimple, ArrowLeft,
  Globe, Gavel, FileText
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

export default function Privacy() {
  const lastUpdated = "May 25, 2026";

  const policies = [
    {
      id: "general",
      icon: Eye,
      title: "1. General, Applicability & Access (A, B, C, D)",
      content: `Northend Educational World (an Authorised Unacademy Franchise) respects your privacy. This Policy explains the types of information we collect when you use our Platform, how we store and share it, and your privacy rights. 
      
By accessing our Platform, providing your Personal Information, or signalling your agreement, you consent to the collection and use of information described herein. If you do not agree, you may access, modify, or delete your information as per this Policy.

Applicability: This applies to all Users of the Northend Educational World Platform. While Unacademy manages several other platforms, this Policy specifically governs your interactions with Northend. 

Children: We do not knowingly collect Personal Information from Minors without Parent consent. Parents must register on behalf of Minors. If you believe your Child faces abuse or harassment, contact legal@northendedu.com.`
    },
    {
      id: "collection",
      icon: Database,
      title: "2. Information We Collect (E, F, G)",
      content: `We collect information to provide and improve our Services. 

Personal Information: Information identifying a User (name, email, age, location, phone number).
Sensitive Personal Information: Includes financial data, official identifiers (such as biometric data, [Aadhaar Redacted], social security number, driver's license, passport), and passwords. 

Sources of Collection:
• From You: Basic account info, KYC information (PAN, [Aadhaar Redacted], etc. for Content Providers), public profile info, and communications.
• Automatically: Device and log information (IP address, browser type), usage metrics, location data, and information from cookies.
• Other Sources: From publicly available sources or third-party integrations (like Google Sign-in).`
    },
    {
      id: "usage",
      icon: Users,
      title: "3. Basis of Collection, Use, and Sharing (H, I)",
      content: `We collect and process your information based on Consent and Compliance with legal obligations. We use it to:
• Provide Services, maintain your account, and verify User identity.
• Improve Platform safety, prevent fraud, and customize new features.
• Market our Platform and communicate promotional offers (with opt-out options).
• Establish or defend legal claims and obtain professional risk advice.

Sharing & Disclosure: We do not sell your Personal Information. We share data strictly on a need-to-know basis with:
• Affiliates & Subsidiaries: Including our parent franchise partner, Unacademy, for national-level mock tests and curriculum integration.
• Third-Party Vendors: Payment processors, customer support software, and analytics providers.
• Legal Authorities: In response to court orders or to protect the safety and rights of Northend, Unacademy, and our users.`
    },
    {
      id: "storage",
      icon: Globe,
      title: "4. Storage, Cross-Border Transfer & Security (J, K, N)",
      content: `Your information is stored, processed, and transferred to highly secure servers (such as AWS) located in India, Singapore, or the USA. By using our Platform, you consent to this cross-border transfer.

Duration: We retain your information as long as required to provide Services or comply with legal business requirements. If you delete your account, data is removed or fully anonymized.

Security: We use Transport Layer Security (TLS) and robust procedural safeguards to protect your data. All KYC information is fully encrypted. While no system is 100% secure, we strictly enforce unauthorized access protocols. Please protect your own account passwords carefully.`
    },
    {
      id: "rights",
      icon: Gavel,
      title: "5. Your Choices & Rights (L, M, O, P)",
      content: `You have the right to limit the information you provide and opt-out of promotional communications (via platform settings or emailing help@northendedu.com). 

Standard Rights Include:
• Right to Confirmation & Access: To view the data we hold about you.
• Right to Correction: To fix inaccurate or out-of-date information.
• Right to be Forgotten: To restrict continuing disclosure.
• Right to Erasure: To permanently delete your account and associated data.

Interest-Based Ads: We may display targeted ads based on your activity. We follow Advertising Standards Council of India guidelines. You can modify cookie preferences directly in your browser.`
    },
    {
      id: "regional",
      icon: FileText,
      title: "6. Country & State Specific Terms (S, T, U, V)",
      content: `Indian Residents: Protected under the applicable Personal Data Protection laws, securing rights to data portability, access, correction, and erasure.
      
UK/EU/EEA Residents (GDPR): Rights to restrict processing, object to automated decision-making/profiling, and lodge complaints with Supervisory Authorities.

California Residents (CCPA): 
• Right to know what categories of info we collect (Identifiers, Geolocation, Inferences).
• Right to request deletion of data.
• We have not sold Personal Information in the preceding 12 months.
• Authorized agents may submit requests on your behalf with signed permission.
• Right to Non-Discrimination for exercising your CCPA rights.`
    }
  ];

  return (
    <div data-testid="privacy-page" className="min-h-screen relative overflow-hidden pb-24">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="ambient-orb ambient-orb--primary drift" style={{ width: 600, height: 600, top: "-100px", right: "-200px", opacity: 0.4 }} />
      <div className="ambient-orb ambient-orb--accent drift" style={{ width: 400, height: 400, top: "40%", left: "-150px", opacity: 0.3 }} />

      {/* ============================== HEADER ============================== */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            
            <Eyebrow>Legal & Compliance</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light tracking-[-0.02em] leading-[1.05] mt-4 mb-6">
              Privacy <span className="font-medium italic bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent text-glow-accent">Policy.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Your trust is our foundation. Discover how we protect, manage, and secure your data across our digital platforms and Kashmir physical centers.
            </p>
            <div className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40 font-mono">
              Last Updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================== CONTENT PANELS ============================== */}
      <section className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 flex flex-col gap-6">
          {policies.map((policy, index) => (
            <Reveal key={policy.id} delay={index * 0.08}>
              <GlassPanel elevated className="p-8 lg:p-10 transition-all hover:border-accent/20">
                <div className="flex items-start gap-5">
                  <div className="p-3 rounded-full bg-accent/10 shrink-0 hidden sm:block">
                    <policy.icon weight="duotone" size={28} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-medium mb-4 flex items-center gap-3">
                      <policy.icon weight="duotone" size={24} className="text-accent sm:hidden" />
                      {policy.title}
                    </h2>
                    <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-line text-sm lg:text-base">
                      {policy.content}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </Reveal>
          ))}

          {/* ============================== GRIEVANCES ============================== */}
          <Reveal delay={0.4}>
            <GlassPanel elevated className="p-8 lg:p-10 border-accent/30 bg-accent/5">
              <div className="flex items-start gap-5">
                <div className="p-3 rounded-full bg-accent/20 shrink-0 hidden sm:block">
                  <EnvelopeSimple weight="duotone" size={28} className="text-accent" />
                </div>
                <div className="w-full">
                  <h2 className="font-display text-2xl font-medium mb-4 flex items-center gap-3">
                     <EnvelopeSimple weight="duotone" size={24} className="text-accent sm:hidden" />
                     7. Privacy Grievances (Q, R)
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base mb-6">
                    Our business changes constantly and our Policy may change from time to time. We encourage you to check our Platform frequently. If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Grievance Officer:
                  </p>
                  <div className="bg-background/50 rounded-xl p-5 border border-border font-mono text-sm space-y-3 w-full">
                    <p><span className="text-white/50 block mb-1">Email:</span> privacy@northendedu.com</p>
                    <div className="h-px w-full bg-border/50" />
                    <p><span className="text-white/50 block mb-1">Registered Address:</span> 
                      Northend Educational World<br/>
                      Head Office, Srinagar,<br/>
                      Jammu & Kashmir, India.
                    </p>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* ============================== BOTTOM CTA ============================== */}
      <section className="relative mt-20 text-center">
        <div className="max-w-2xl mx-auto px-4 lg:px-8">
          <Reveal>
            <h3 className="font-display text-3xl font-light mb-6">Have questions about your data?</h3>
            <Link to="/contact">
              <CTAPrimary>Talk to our legal team</CTAPrimary>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}