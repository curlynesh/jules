import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Link from 'next/link';
import { ActivitySquare, ShieldCheck, Database, LayoutDashboard } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-dyslexic' });

export const metadata: Metadata = {
  title: "Neuro-Inclusive Assessment Engine",
  description: "A framework for psychometric intelligence and accommodations.",
};

function Navigation() {
    return (
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-[100] h-16 flex items-center">
            <div className="max-w-6xl w-full mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <ActivitySquare size={18} />
                    </div>
                    <span>Cognitive<span className="text-blue-600">Engine</span></span>
                </Link>
                <div className="flex gap-6 items-center">
                    <Link href="/assess" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                         Assessment
                    </Link>
                    <Link href="/enterprise" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                        <LayoutDashboard size={14} /> Enterprise
                    </Link>
                    <Link href="/builder" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                        <Database size={14} /> Builder
                    </Link>
                    <Link href="/privacy" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                        <ShieldCheck size={14} /> Privacy
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${openSans.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-200 dark:selection:bg-blue-900`}>
        <Navigation />
        <div className="flex-1 mt-16">
           {children}
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
