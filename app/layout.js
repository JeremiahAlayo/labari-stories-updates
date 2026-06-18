import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata = {
  metadataBase: new URL("https://www.labaribooks.com"),
  title: {
    default: "Labari Stories & Updates",
    template: "%s | Labari Blog"
  },
  description:
    "Read Labari platform updates, user guides, tutorials, announcements, and articles about multi-format storytelling.",
  openGraph: {
    title: "Labari Blog",
    description:
      "Platform updates, guides, tutorials, and announcements from Labari.",
    url: "/blog",
    siteName: "Labari",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics measurementId={gaMeasurementId} />
      </body>
    </html>
  );
}
