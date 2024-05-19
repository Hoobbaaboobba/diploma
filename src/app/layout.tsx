import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/entities/ConvexProvider/ConvexClientProvider";
import { Logout } from "@/features/Logout";
import { getSession } from "../../lib";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diploma",
  description: "Created by",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Logout session={session} />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
