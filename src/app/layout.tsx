import "./globals.css";

export const metadata = {
  title: "Manaswini Ragamouni",
  description:
    "Software Engineer | Distributed Systems | AWS | Aurora Serverless | OpenSearch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
