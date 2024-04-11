import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface TaskData {
  id: number;
  task: string;
  description: string;
  state: string;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState<TaskData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState({ id: null, task: '', description: '' });

  const columns = [
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: 'pointer', marginRight: '8px', color: '#39A7FF' }}
            onClick={() =>
              handleOpenEditModal(params.row.id, params.row.task, params.row.description)
            }
          />
          <DeleteIcon
            style={{ cursor: 'pointer', color: 'red'}}
            onClick={() => handleDeleteRow(params.row.id)}
          />
        </div>
      ),
    },
    { field: 'id', headerName: 'Id', width: 150 },
    { field: 'task', headerName: 'Tarea', width: 200 },
    { field: 'description', headerName: 'Descripcion', width: 200 },
    { field: 'state', headerName: 'Estado', width: 200 },
  ];

  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleOpenEditModal = (id: any, task: any, description: any) => {
    setEditedTask({ id, task, description });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveEdit = () => {
    // Realiza la solicitud PUT para actualizar los datos en la base de datos
    fetch('/api/databaseTaskEdit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editedTask.id,
        name: editedTask.task,
        description: editedTask.description,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Actualiza el estado local 'data' con los cambios realizados
        const updatedData = data.map((row) =>
          row.id === editedTask.id ? { ...row, task: editedTask.task, description: editedTask.description } : row
        );
        setData(updatedData);
  
        console.log('Guardar cambios:', editedTask);
        handleCloseEditModal();
      })
      .catch((error) => {
        console.error('Error al guardar cambios:', error);
        // Maneja el error según tus necesidades
      });
  };
  const handleDeleteRow = (id: any) => {
    // Implementa la lógica para eliminar la fila con el ID proporcionado
    console.log('Eliminar fila con ID:', id);
  };

  const fetchData = () => {
    // Realiza una solicitud GET a tu nuevo API para obtener los datos de la base de datos
    fetch('/api/database') // Cambia la ruta según tu nueva API
      .then((response) => response.json())
      .then((result) => {
        // Mapea los datos para cambiar la propiedad 'Id' a 'id'
        const mappedData = result.data.map((row: { Id: any; Name: any; Descrition: any; state: any; }) => ({
          id: row.Id, // Cambia 'Id' a 'id'
          task: row.Name,
          description: row.Descrition, // Cambia 'Id' a 'id'
          state: row.state, // Mantén 'Name' como 'name'
          // Agrega otras propiedades si es necesario
        }));

        setData(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    // Realiza la primera consulta al cargar el componente
    fetchData();

    // Configura una consulta periódica cada 5 segundos (ajusta el intervalo según tus necesidades)
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval); // Limpia el intervalo al desmontar el componente
    };
  }, []);

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection);
        }}
        components={{
          Toolbar: (props) => (
            <div>
              <GridToolbar {...props} />
            </div>
          ),
        }}
        autoGroupColumnDef={{
          headerName: 'Commodity',
          field: 'commodity',
        }}
        renderCell={(params: { row: { id: any; task: any; description: any; }; }) => (
          <div>
            <EditIcon
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() =>
                handleOpenEditModal(params.row.id, params.row.task, params.row.description)
              }
            />
            <DeleteIcon
              style={{ cursor: 'pointer' }}
              onClick={() => handleDeleteRow(params.row.id)}
            />
          </div>
        )}
      />

      {/* Modal de Edición */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Ajusta el último valor (0.9) para cambiar la opacidad
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Editar Datos
            </Typography>
            <TextField
              label="Nombre"
              defaultValue={editedTask.task}
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
            />
            <TextField
              label="Descripción"
              defaultValue={editedTask.description}
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />
            <Button variant="contained" onClick={handleSaveEdit} sx={{ marginRight: 2 }}>
              Guardar cambios
            </Button>
            <Button variant="contained" onClick={handleCloseEditModal} color="error">
              Cancelar
            </Button>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
