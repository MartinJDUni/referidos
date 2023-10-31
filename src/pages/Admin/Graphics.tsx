import React, { useState, useEffect } from 'react';
import { Layout, Modal, Select, DatePicker, Button, Input } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import PieChart from '../components/graPie';
import DataGridPremiumDemo from '@/pages/components/tablaET';
import BarChart from '../components/graBar';

const { Header, Content } = Layout;
const { Option } = Select;

const Graphic: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const response = await fetch('/api/databaseEmployeeTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Idemployee: selectedEmployee,
          Idtask: selectedTask,
          Goal: goal,
          Startdate: startDate,
          Finaldate: endDate,
          state: 1, 
        }),
      });

      if (response.ok) {
        // Manejar la respuesta exitosa si es necesario
        console.log('Datos de la meta asignados con éxito');
      } else {
        console.error('Error al enviar los datos del modal al servidor');
      }
    } catch (error) {
      console.error('Error al enviar los datos del modal al servidor:', error);
    }

    setIsModalVisible(false);
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reemplaza esta URL con la dirección correcta de tu API
        const response = await fetch('/api/databaseEmployeeTask');
        if (response.ok) {
          const data = await response.json();
          setEmployeeOptions(data.employees);
          setTaskOptions(data.tasks);
        } else {
          console.error('Error al obtener la lista de empleados y tareas');
        }
      } catch (error) {
        console.error('Error al obtener la lista de empleados y tareas:', error);
      }
    };

    fetchData();
  }, []);

  const pieChartData = [12, 19, 3, 17, 6];
  const pieChartLabels = ['Manzanas', 'Plátanos', 'Uvas', 'Naranjas', 'Cerezas'];

  const barChartData = [10, 15, 8, 25, 12];
  const barChartLabels = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];

  const fieldStyle = {
    marginBottom: '15px',
  };

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
              <BarChart />
            </div>

            <Button type="primary" onClick={showModal}>
              Asignar meta
            </Button>
            <Modal
              title="Asignar meta"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div style={fieldStyle}>
                <label>Meta:</label>
                <Input value={goal} onChange={(e) => setGoal(e.target.value)} />
              </div>
              <div style={fieldStyle}>
                <label>Empleado:</label>
                <Select
                  style={{ width: 200 }}
                  value={selectedEmployee}
                  onChange={(value) => setSelectedEmployee(value)}
                >
                  <Option value="" disabled>
                    Selecciona un empleado
                  </Option>
                  {employeeOptions.map((employee) => (
                    <Option key={employee.Id} value={employee.Id.toString()}>
                      {employee.Name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div style={fieldStyle}>
                <label>Nombre de la tarea:</label>
                <Select
                  style={{ width: 200 }}
                  value={selectedTask}
                  onChange={(value) => setSelectedTask(value)}
                >
                  <Option value="" disabled>
                    Selecciona una tarea
                  </Option>
                  {taskOptions.map((task, index) => (
                    <Option key={index} value={task.Id}>
                      {task.Name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div style={fieldStyle}>
                <label>Fecha de inicio:</label>
                <DatePicker value={startDate} onChange={(date) => setStartDate(date)} />
              </div>
              <div style={fieldStyle}>
                <label>Fecha final:</label>
                <DatePicker value={endDate} onChange={(date) => setEndDate(date)} />
              </div>
            </Modal>
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
