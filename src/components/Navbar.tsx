'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoLogOut, IoMoon, IoSunny } from 'react-icons/io5';
import DarkTheme from './DarkTheme';
import { useState } from 'react';
import { Button, Modal } from 'antd';

const Navbar = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <>
      <div className="w-full py-8 bg-blue-800 px-4 lg:px-20">
        <div className="flex justify-between items-center">
          <Link href={'/'}>
            <h1 className="font-bold text-2xl text-white">BlogHive</h1>
          </Link>
          <div className="flex items-center gap-5">
            <div className="flex items-center text-white gap-1">
              <IoSunny />
              <DarkTheme />
              <IoMoon />
            </div>
            <div
              onClick={openModal}
              className="text-white cursor-pointer"
            >
              <IoLogOut size={25} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Confirm Logout"
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button
            key="cancel"
            onClick={closeModal}
          >
            Cancel
          </Button>,
          <Button
            key="logout"
            type="primary"
            danger
            onClick={handleLogout}
          >
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
};

export default Navbar;
