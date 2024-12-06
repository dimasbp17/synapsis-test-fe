import React, { useState, useEffect } from 'react';
import { Space, Switch } from 'antd';

const DarkTheme: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-theme');
    }
  }, []);

  return (
    <Space direction="vertical">
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
    </Space>
  );
};

export default DarkTheme;
