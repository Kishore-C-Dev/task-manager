import React from 'react';
import { NavLink } from 'react-router-dom';
import appConfig from '../config/appConfig.json';
import { AppConfig } from '../types';

const config = appConfig as AppConfig;

const iconMap: Record<string, string> = {
  inbox: '\u{1F4E5}',
  check: '\u{2705}',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1 className="app-title">{config.app.title}</h1>
        <nav className="nav-list">
          {config.app.navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{iconMap[item.icon] || ''}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
