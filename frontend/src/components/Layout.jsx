import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

// basePath is forwarded from StudentLayout or InstructorLayout
const Layout = ({ basePath }) => {
  return (
    <div className="app-layout">
      <Sidebar basePath={basePath} />
      <main className="main-content">
        <TopNav />
        <div className='content'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
