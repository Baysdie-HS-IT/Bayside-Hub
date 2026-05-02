import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bayside Hub",
    template: "%s | Bayside Hub"
  },
  description: "A focused, modern portal for classes, activities, announcements, and school operations."
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          // inline script runs before React hydration to avoid flash-of-light
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    var theme = null;
    try { theme = localStorage.getItem('bayside.theme'); } catch(e) { theme = null; }
    if (theme === 'dark') { document.documentElement.classList.add('dark'); return; }
    if (theme === 'light') { document.documentElement.classList.remove('dark'); return; }
    // 'system' or null -> follow OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) { /* ignore */ }
})();`
          }}
        />
        {children}
      </body>
    </html>
  );
}
