import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="">{children}</div>
    </>
  );
};

export default Layout;
