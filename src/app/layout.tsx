import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Assistant from "@/components/Assistant";

export const viewport: Viewport = { themeColor: "#14161a", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL("https://tcdortodoncia.com"),
  title: { default: "TCD Ortodoncia · Laboratorio de ortodoncia, apnea y ortodoncia digital 3D", template: "%s · TCD Ortodoncia" },
  description:
    "Laboratorio de ortodoncia en Santander, Las Palmas y Bilbao. Aparatología, apnea (D.A.M.A. TCD® patentado), cementado indirecto, MARPE y ortodoncia digital 3D. 8 h de producción y portes gratis.",
  robots: { index: false, follow: false }, // demo: no indexar
  openGraph: { title: "TCD Ortodoncia", description: "Precisión digital. Entregas en 8 horas.", images: ["/assets/tcd/IBT-02.jpg"], locale: "es_ES", type: "website" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TCD Ortodoncia",
  legalName: "SIKKER SVAR S.L.",
  url: "https://tcdortodoncia.com",
  sameAs: ["https://linkedin.com/company/tcd-ortodoncia", "https://www.facebook.com/TCDORTO/"],
  department: [
    { "@type": "DentalLaboratory", name: "TCD Ortodoncia Santander", telephone: "+34942231236", address: { "@type": "PostalAddress", streetAddress: "Avenida Pedro San Martín 16", postalCode: "39007", addressLocality: "Santander", addressCountry: "ES" } },
    { "@type": "DentalLaboratory", name: "TCD Ortodoncia Las Palmas", telephone: "+34928272686", address: { "@type": "PostalAddress", streetAddress: "Calle Costa Rica 3", postalCode: "35010", addressLocality: "Las Palmas de Gran Canaria", addressCountry: "ES" } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBar />
        <Assistant />
      </body>
    </html>
  );
}
