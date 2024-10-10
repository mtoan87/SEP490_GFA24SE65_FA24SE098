import { Layout, Button, Space } from 'antd';
import { BellOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderComponent = () => {
  return (
    <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="text-xl font-bold"></div>
      <Space>
        <Button type="text" icon={<SettingOutlined />} />
        <Button type="text" icon={<BellOutlined />} />
        <Button type="text" icon={<UserOutlined />} />
      </Space>
    </Header>
  );
};

export default HeaderComponent;
