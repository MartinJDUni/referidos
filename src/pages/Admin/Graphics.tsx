import React, { useState, useEffect } from 'react';
import { Layout, Modal, Select, DatePicker, Button, Input } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import DataGridPremiumDemo from '@/pages/components/tablaET';
import BarChart from '../components/graBar';
import CustomBarChart from '../components/graPie';
import ProgressBarChart from '../components/ToPro';
import dayjs, { Dayjs } from 'dayjs';


const { Header, Content } = Layout;
const { Option } = Select;

const Graphic: React.FC = () => {
  const [employeeOptions, setEmployeeOptions] = useState<{ Id: number; Name: string; }[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [taskOptions, setTaskOptions] = useState<{ Id: number; Name: string; }[]>([]);
  const [error, setError] = useState({
    goal: '',
    selectedEmployee: '',
    selectedTask: '',
    startDate: '',
    endDate: '',
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      goal: '',
      selectedEmployee: '',
      selectedTask: '',
      startDate: '',
      endDate: '',
    };

    if (!goal.trim()) {
      newErrors.goal = 'La meta es obligatoria';
      valid = false;
    }

    if (!selectedEmployee) {
      newErrors.selectedEmployee = 'Selecciona un empleado';
      valid = false;
    }

    if (!selectedTask) {
      newErrors.selectedTask = 'Selecciona una tarea';
      valid = false;
    }

    if (!startDate) {
      newErrors.startDate = 'Selecciona una fecha de inicio';
      valid = false;
    }

    if (!endDate) {
      newErrors.endDate = 'Selecciona una fecha final';
      valid = false;
    } else if (startDate && endDate && startDate >= endDate) {
      newErrors.endDate = 'La fecha final debe ser posterior a la fecha de inicio';
      valid = false;
    }

    setError(newErrors);
    return valid;
  };

  const handleOk = async () => {
    if (validateForm()) {
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
          console.log('Datos de la meta asignados con éxito');
        } else {
          console.error('Error al enviar los datos del modal al servidor');
        }
      } catch (error) {
        console.error('Error al enviar los datos del modal al servidor:', error);
      }

      setIsModalVisible(false);
    }
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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

          <div>
            <div>
              <BarChart />
            </div>
            <div>
              <CustomBarChart />
            </div>
          </div>
          <div className="charts-container">
            <Button type="primary" style={{ float: 'right' }} onClick={showModal}>
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
                <span style={{ color: 'red' }}>{error.goal}</span>
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
                <span style={{ color: 'red' }}>{error.selectedEmployee}</span>
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
                <span style={{ color: 'red' }}>{error.selectedTask}</span>
              </div>
              <div style={fieldStyle}>
                <label>Fecha de inicio:</label>
                <DatePicker value={startDate} onChange={(date) => setStartDate(date)} />
                <span style={{ color: 'red' }}>{error.startDate}</span>
              </div>
              <div style={fieldStyle}>
                <label>Fecha final:</label>
                <DatePicker value={endDate} onChange={(date) => setEndDate(date)} />
                <span style={{ color: 'red' }}>{error.endDate}</span>
              </div>
            </Modal>
          </div>
          <div className="data-grid" style={{ marginTop: '70px', padding: '50px', backgroundColor: 'white', marginBottom: '10px' }}>
            <DataGridPremiumDemo />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Graphic;
