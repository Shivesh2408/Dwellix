import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { PageLoader } from "@/components/common/page-loader";
import { CustomCursor } from "@/components/common/custom-cursor";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dwellix | Your Home. Smarter Every Day.",
  description: "AI-powered Home Management Platform to manage appliances, warranties, invoices, book technicians, and diagnose appliance issues.",
  keywords: [
    "home management",
    "AI appliance diagnosis",
    "warranty vault",
    "technician marketplace",
    "home health score",
    "invoice manager",
  ],
  authors: [{ name: "Dwellix Team" }],
  openGraph: {
    title: "Dwellix | Your Home. Smarter Every Day.",
    description: "Intelligent Home Management Platform powered by Gemini AI. Manage appliances, digital warranties, and service bookings.",
    url: "https://dwellix.com",
    siteName: "Dwellix",
    images: [
      {
        url: "https://dwellix.com/logo/dwellix-logo-light.png",
        width: 800,
        height: 600,
        alt: "Dwellix Home Management Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwellix | Your Home. Smarter Every Day.",
    description: "Intelligent Home Management Platform powered by Gemini AI. Manage appliances, digital warranties, and service bookings.",
    images: ["https://dwellix.com/logo/dwellix-logo-light.png"],
  },
  metadataBase: new URL("https://dwellix.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PageLoader />
          <CustomCursor />
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
