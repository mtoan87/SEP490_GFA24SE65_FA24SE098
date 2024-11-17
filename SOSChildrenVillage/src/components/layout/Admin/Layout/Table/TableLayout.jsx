import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminLayout from '../../AdminLayout';

const { Content } = Layout;

const TableLayout = () => {
  return (
    <AdminLayout>
      <Content
        style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)', // 64px header + 24px * 2 margin
            boxShadow: '0 0 0 2px rgba(0,21,41,.08)',         
          }}
      >
        <Outlet />
      </Content>
    </AdminLayout>
  );
};

export default TableLayout;