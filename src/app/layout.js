import Script from "next/script";
import { Providers } from "@/components/layout/Providers";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata = {
  title: "StudyAI - Smart Study Planner",
  description: "AI-powered study planner and revision tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6CP8SYQC77"
        />

        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6CP8SYQC77');
            `,
          }}
        />
      </head>

      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
