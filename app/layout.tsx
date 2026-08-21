import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dulcemente | Pastelería artesanal",
  description: "Pasteles y pequeños antojos decorados a mano para celebrar tus momentos más dulces.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: { title: "Dulcemente | Pastelería artesanal", description: "Momentos que saben dulce, decorados a mano.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Dulcemente | Pastelería artesanal", description: "Momentos que saben dulce, decorados a mano.", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
