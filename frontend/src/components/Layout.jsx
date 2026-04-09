import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
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
