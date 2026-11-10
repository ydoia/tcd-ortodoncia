import Hero from "@/components/Hero";
import {
  ScannerMarquee,
  IntentSplit,
  Stats,
  SolutionsBento,
  Process,
  Advantages,
  DamaFeature,
  LabsStrip,
  Testimonials,
  FAQSection,
  FinalCTA,
} from "@/components/HomeSections";
import { FAQS } from "@/lib/data";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <ScannerMarquee />
      <IntentSplit />
      <Stats />
      <SolutionsBento />
      <Process />
      <Advantages />
      <DamaFeature />
      <LabsStrip />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
