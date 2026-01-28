import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { TemplateModalProvider } from '@/contexts/TemplateModalContext';
import { ProjectModalProvider } from '@/contexts/ProjectModalContext';
import { IntroLoader } from '@/components/common/IntroLoader';
import { TemplateModal } from '@/components/modals/TemplateModal';
import { ProjectModal } from '@/components/modals/ProjectModal';
import Header from '@/components/layout/Header/Header';

import "./globals.css";

export const metadata: Metadata = {
  title: "minihome",
  description: "minihome",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <LoadingProvider>
          <TemplateModalProvider>
            <ProjectModalProvider>
              <NextIntlClientProvider messages={messages}>
                <IntroLoader />
                <Header />
                <main>
                  {children}
                </main>
                <TemplateModal />
                <ProjectModal />
              </NextIntlClientProvider>
            </ProjectModalProvider>
          </TemplateModalProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
