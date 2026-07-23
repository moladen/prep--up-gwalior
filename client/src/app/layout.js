import { Plus_Jakarta_Sans, Playfair_Display, Great_Vibes } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import { siteInfo } from "@/data/content";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-body",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-achiever-display",
  weight: ["700", "800"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-achiever-script",
  weight: "400",
});

export const metadata = {
  title: {
    default: `${siteInfo.name} | Premier Coaching Institute in Gwalior`,
    template: `%s | ${siteInfo.name}`,
  },
  description: siteInfo.description,
  keywords: [
    "Prep Up Gwalior",
    "coaching institute Gwalior",
    "CLAT coaching",
    "CAT coaching",
    "SSC coaching",
    "IPMAT coaching",
    "competitive exam preparation",
  ],
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: siteInfo.name,
    description: siteInfo.description,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${playfair.variable} ${greatVibes.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <Script
          id="strip-fdprocessedid"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.querySelectorAll("[fdprocessedid]").forEach(function(el){el.removeAttribute("fdprocessedid")})}catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
