import 'react-toastify/dist/ReactToastify.css';
import { FC, Suspense } from 'react';

import Header from '@/components/Header';

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

const MainLayout: FC<RootLayoutProps> = ({ children }) => (
  <>
    <Header />
    <main className="flex w-full max-w-screen-2xl flex-grow justify-center p-5 md:px-10 md:pt-8">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </main>
  </>
);

export default MainLayout;
