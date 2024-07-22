'use client';

import 'react-toastify/dist/ReactToastify.css';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { FC, Suspense } from 'react';

import TelegramAuth from './_components/TelegramAuth';

import { BrandLoader } from '@/components/ui/Loader';

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

const MainLayout: FC<RootLayoutProps> = ({ children }) => (
  <main className="flex w-full max-w-screen-2xl flex-grow justify-center p-5 pb-20 md:px-10 md:pt-8">
    <SDKProvider>
      <TelegramAuth />
      <Suspense fallback={<BrandLoader />}>{children}</Suspense>
    </SDKProvider>
  </main>
);

export default MainLayout;
