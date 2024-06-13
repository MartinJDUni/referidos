import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

interface RowData {
  id: number;
  nombre_empleado: string;
  rol_empleado: string;
  total_tareas: number;
  tareas_aceptadas: number;
  fecha: string;
  state: number;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState<RowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [roles, setRoles] = React.useState<{ id: number; name: string }[]>([]);
  const [subtareas, setSubtareas] = React.useState<{ id: number; name: string }[]>([]);
  const [empleados, setEmpleados] = React.useState<{ id: number; name: string; idRol: number }[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = React.useState<number | null>(null);
  const [selectedSubtareaId, setSelectedSubtareaId] = React.useState<number | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string>('');

  const getProgressColor = (value: number) => {
    if (value <= 30) {
      return {
        background: '#E53935',
        bar: '#C62828',
      };
    } else if (value < 80) {
      return {
        background: '#FFC107',
        bar: '#FFA000',
      };
    } else {
      return {
        background: '#4CAF50',
        bar: '#2E7D32',
      };
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: 'pointer', marginRight: '8px', color: '#39A7FF' }}
            onClick={() => handleEditRow(params.row.id)}
          />
          {params.row.state === 0 ? (
            <React.Fragment>
              <span
                style={{ cursor: 'pointer', marginRight: '8px' }}
                onClick={() => handleReactivateRow(params.row.id)}
              >
                Reactivar
              </span>
            </React.Fragment>
          ) : (
            <DeleteIcon
              style={{ cursor: 'pointer', color: '#EB455F' }}
              onClick={() => handleDeleteRow(params.row.id)}
            />
          )}
        </div>
      ),
    },
    { field: 'id', headerName: 'Id', width: 50 },
    { field: 'nombre_empleado', headerName: 'Nombre', width: 150 },
    { field: 'rol_empleado', headerName: 'Rol', width: 150 },
    { field: 'total_tareas', headerName: 'Meta', width: 80 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'aceptadas', headerName: 'Aceptadas', width: 80 },
    {
      field: 'tareas_aceptadas',
      headerName: 'Completados',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      renderCell: (params) => {
        const { background, bar } = getProgressColor(params.value || 0);

        return (
          <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={params.value || 0}
              sx={{
                width: '80%',
                height: 20,
                borderRadius: 4,
                backgroundColor: background,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: bar,
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
              {typeof params.value === 'number' ? `${params.value.toFixed(2)}%` : ''}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const handleEditRow = (id: number) => {
    // Implementar lógica para editar
  };

  const handleReactivateRow = async (id: number) => {
    try {
      await fetch('/api/databaseReac', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      fetchData();
    } catch (error) {
      console.error('Error al reactivar el estado en la base de datos desde el cliente:', error);
    }
  };

  const handleDeleteRow = async (id: number) => {
    try {
      await fetch('/api/databaseET', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      fetchData();
    } catch (error) {
      console.error('Error al actualizar el estado en la base de datos desde el cliente:', error);
    }
  };

  const fetchData = React.useCallback(() => {
    fetch('/api/graTabla')
      .then((response) => response.json())
      .then((resultET) => {
        const mappedDataET = resultET.data.map((row: any) => ({
          id: row.id_empleado,
          nombre_empleado: row.nombre_empleado,
          rol_empleado: row.rol_empleado,
          total_tareas: row.total_tareas,
          aceptadas: row.tareas_aceptadas,
          tareas_aceptadas: row.tareas_aceptadas * 100 / row.total_tareas,
          fecha: row.fecha,
        }));
        setData(mappedDataET);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false);
      });
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data.map((role: any) => ({ id: role.id, name: role.rol })));
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const fetchSubtareas = async () => {
    try {
      const response = await fetch('/api/dbSub');
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubtareas(data.map((subtarea: any) => ({
          id: subtarea.id,
          name: `Subtarea ${subtarea.id}`
        })));
      } else {
        throw new Error('Formato de datos inesperado');
      }
    } catch (error) {
      console.error('Error al obtener subtareas:', error);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('/api/databaseemployee');
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setEmpleados(data.data.map((empleado: any) => ({
          id: empleado.id,
          name: empleado.name,
          idRol: empleado.idRol
        })));
      } else {
        throw new Error('Formato de datos inesperado');
      }
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleEmployeeChange = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    const empleado = empleados.find((e) => e.id === employeeId);
    if (empleado) {
      setSelectedRoleId(empleado.idRol);
    } else {
      setSelectedRoleId(null);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
    fetchRoles();
    fetchSubtareas();
    fetchEmpleados();
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedEmployeeId(null);
    setSelectedRoleId(null);
    setSelectedSubtareaId(null);
    setSelectedDate('');
  };

  const handleSave = async () => {
    // Verificar que todos los campos estén completos
    if (!selectedEmployeeId || !selectedRoleId || !selectedSubtareaId || !selectedDate) {
      console.error('Faltan campos por completar.');
      return;
    }

    try {
      const response = await fetch('/api/empleado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idEmployee: selectedEmployeeId,
          idRole: selectedRoleId,
          idSubTask: selectedSubtareaId,
          date: selectedDate,
          status: 1,
        }),
      });

      if (response.ok) {
        fetchData();
        handleCloseModal();
      } else {
        console.error('Error al insertar datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  React.useEffect(() => {
    fetchData();

    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [fetchData]);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', margin: '0', padding: '5px' }}>Tabla de progreso por trabajador</h3>
      </div>
      <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginBottom: '10px' }}>
        Nuevo Modal
      </Button>
      <Box sx={{ height: 500, width: '100%', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Nuevo Modal</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Empleado</InputLabel>
            <Select
              value={selectedEmployeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
            >
              {empleados.map((empleado) => (
                <MenuItem key={empleado.id} value={empleado.id}>
                  {empleado.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={selectedRoleId || ''}
              onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Subtarea</InputLabel>
            <Select
              value={selectedSubtareaId || ''}
              onChange={(e) => setSelectedSubtareaId(Number(e.target.value))}
            >
              {subtareas.map((subtarea) => (
                <MenuItem key={subtarea.id} value={subtarea.id}>
                  {subtarea.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Fecha"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
