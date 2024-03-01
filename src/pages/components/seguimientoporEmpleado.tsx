import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function DataGridPremiumDemo({ onClickVerComentarios }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [taskStates, setTaskStates] = useState([]);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    phone: '',
    idcard: '',
  });
  const [openAddEmployeeDialog, setOpenAddEmployeeDialog] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log("userId al cargar la página:", storedUserId);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/databaseEmployeeS')
        .then((response) => response.json())
        .then((result) => {
          const mappedData = result.statetask.map((row) => ({
            id: row.Id,
            state: row.State,
          }));
          console.log('Datos obtenidos de la API:', mappedData);
          setTaskStates(mappedData);
        })
        .catch((error) => {
          console.error('Error al obtener datos de la base de datos:', error);
        });
    };

    fetchData();
  }, []);

  const handleEditRow = (id) => {
    console.log('Editar fila con ID:', id);
    setSelectedRowId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const isValidState = taskStates.some(state => state.id === selectedState);
      console.log(isValidState);
      if (!isValidState) {
        console.error('El estado seleccionado no es válido.');
        return;
      }

      const updateTaskStateUrl = '/api/databaseEmployeeS';
      const updateTaskStateBody = {
        id: selectedRowId,
        newState: selectedState,
      };

      const response = await fetch(updateTaskStateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTaskStateBody),
      });

      if (response.ok) {
        console.log('Estado de la tarea actualizado correctamente');
        fetchData();
        handleCloseDialog();
      } else {
        console.error('Error al actualizar el estado de la tarea:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const addEmployeeUrl = '/api/databaseEmployeeS'; // Ruta para agregar empleado, asegúrate de que sea la correcta
      const response = await fetch(addEmployeeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployeeData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const clientId = responseData.clientId; // Extrae el ID del cliente de la respuesta
  
        // Llama a la segunda API para agregar la relación en la otra tabla
        const addRelationshipUrl = '/api/databaseClientID'; // Ruta para la segunda API, ajústala según sea necesario
        const relationshipResponse = await fetch(addRelationshipUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Idclient: clientId,
            Idemployee: userId,
            Idstatetask: 3, // Valor por defecto para Idstatetask
            state: 1, // Valor por defecto para state
            date: new Date().toISOString().split('T')[0], // Fecha de hoy
          }),
        });
  
        if (relationshipResponse.ok) {
          console.log('Relación agregada correctamente.');
          fetchData();
          setOpenAddEmployeeDialog(false);
        } else {
          console.error('Error al agregar la relación:', relationshipResponse.statusText);
        }
      } else {
        console.error('Error al agregar empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };
  

  const handleNewEmployeeDataChange = (event) => {
    const { name, value } = event.target;
    setNewEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchData = () => {
    if (!userId) {
      console.log("no hay id: ", userId);
      return;
    }

    fetch(`/api/dbTaskPer?employeeId=${userId}`)
      .then((response) => response.json())
      .then((result) => {
        const mappedData = result.data.map((row) => ({
          id: row.Id,
          client: row.ClientName,
          statetask: row.StateTaskName,
          start: new Date(row.date),
          state: row.state,
        }));
        console.log(mappedData);
        setData(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      console.log("Intervalo ejecutado");
      fetchData();
    }, 3000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [userId]);

  const columns = [
    {
      field: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: 'pointer', marginRight: '8px' }}
            onClick={() => handleEditRow(params.row.id)}
          />
          <DeleteIcon
            style={{ cursor: 'pointer', color: 'red'}}
            onClick={() => handleDeleteRow(params.row.id)}
          />
        </div>
      ),
    },
    { field: 'id', headerName: 'Id', width: 50, headerAlign: 'center', align: 'center' },
    { field: 'client', headerName: 'Cliente', headerAlign: 'center', align: 'center', width: 150 },
    {
      field: 'statetask',
      headerName: 'Estado de la tarea',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      cellClassName: (params) => {
        switch (params.value) {
          case 'CANCELADO':
            return 'cancelledCell';
          case 'ACEPTADO':
            return 'acceptedCell';
          case 'EN PROCESO':
            return 'inProcessCell';
          case 'RECHAZADO':
            return 'rejectedCell';
          default:
            return '';
        }
      },
      renderCell: (params) => (
        <div>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => handleEditRow(params.row.id)}
          >
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'start',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Fecha de inicio',
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
    },
    { field: 'state', headerName: 'Estado', headerAlign: 'center', align: 'center', width: 100 },
    {
      field: 'customAction',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Ver comentarios',
      width: 200,
      renderCell: (params) => (
        <button onClick={() => onClickVerComentarios(params.row.id)}>
          Ver comentarios
        </button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 520, width: '100%', backgroundColor: 'white', padding: '16px' }}>
      <button onClick={() => setOpenAddEmployeeDialog(true)}>Agregar cliente</button>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        components={{
          Toolbar: (props) => (
            <div>
              <GridToolbar {...props} />
            </div>
          ),
        }}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cambiar estado de la tarea</DialogTitle>
        <DialogContent>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            fullWidth
            label="Estado de la tarea"
          >
            {taskStates.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {state.state}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddEmployeeDialog} onClose={() => setOpenAddEmployeeDialog(false)}>
        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="name" style={{ marginRight: '8px' }}>Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newEmployeeData.name}
              onChange={handleNewEmployeeDataChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="phone" style={{ marginRight: '8px' }}>Teléfono:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={newEmployeeData.phone}
              onChange={handleNewEmployeeDataChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label htmlFor="idcard" style={{ marginRight: '8px' }}>ID Card:</label>
            <input
              type="text"
              id="idcard"
              name="idcard"
              value={newEmployeeData.idcard}
              onChange={handleNewEmployeeDataChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEmployeeDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddEmployee} variant="contained" color="primary">
            Agregar Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
