import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Wars — A PulseChain Trading Championship",
  description:
    "Real PulseChain wallets, real PLS, real bragging rights. Weekly, monthly, and yearly portfolio competitions.",
  openGraph: {
    title: "Portfolio Wars",
    description: "A PulseChain Trading Championship",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <TopNav />
          <main>{children}</main>
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
