import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import PieChart from '../components/graPie';
import DataGridPremiumDemo from '@/pages/components/tablaET';
import BarChart from '../components/graBar';

const { Header, Content } = Layout;

const Graphic: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const pieChartData = [12, 19, 3, 17, 6];
  const pieChartLabels = ['Manzanas', 'Plátanos', 'Uvas', 'Naranjas', 'Cerezas'];

  const barChartData = [10, 15, 8, 25, 12];
  const barChartLabels = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout>
        <HeaderComponent collapsed={collapsed} onToggle={handleToggleSidebar} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <div className="charts-container">
            <div className="chart">
              <PieChart data={pieChartData} labels={pieChartLabels} />
            </div>
            <div>
              <BarChart/>
            </div>
          </div>
          <div className="data-grid">
            <DataGridPremiumDemo />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Graphic;
