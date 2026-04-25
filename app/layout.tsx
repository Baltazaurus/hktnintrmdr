import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ThemeApplicator from '@/components/ThemeApplicator';
import { AuthProvider } from '@/lib/authStore';

export const metadata: Metadata = {
  title: 'DanubeGuard OS',
  description: 'Citizen science + Copernicus satellite data for a cleaner Danube.',
  themeColor: '#35858E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sand dark:bg-[#111827] transition-colors duration-300">
        <AuthProvider>
          {/* Applies theme class + lang attr to <html> based on user prefs */}
          <ThemeApplicator />
          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar - hidden on mobile, fixed on desktop */}
            <div className="hidden md:block">
              <BottomNav variant="sidebar" />
            </div>
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen md:pl-64">
              <Header />
              <main className="flex-1 pb-28 md:pb-8 pt-safe">{children}</main>
            </div>
          </div>
          {/* Bottom nav - visible only on mobile */}
          <div className="md:hidden">
            <BottomNav variant="bottom" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
