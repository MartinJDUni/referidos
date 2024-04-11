import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface EmployeeData {
  id: number;
  nameemployee: string;
  pass: string;
  email: string;
  state: string;
  rol: string;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState<EmployeeData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState<EmployeeData | null>(null);
  const [selectionModel, setSelectionModel] = React.useState<any[]>([]);

  const columns: GridColDef[] =[
    {
      field: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: 'pointer', marginRight: '8px', color: '#39A7FF' }}
            onClick={() => handleOpenModal(params.row.id)}
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
    { field: 'nameemployee', headerName: 'Nombre', width: 150 },
    { field: 'pass', headerName: 'Contraseña', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'rol', headerName: 'Rol', width: 100 },
    { field: 'state', headerName: 'Estado', width: 75 },
  ];

  const handleOpenModal = (id: any) => {
    const selectedRow = data.find((row) => row.id === id);
    if (selectedRow) {
      setSelectedRowData(selectedRow);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedRowData(null);
    setIsModalOpen(false);
  };

  const handleSaveChanges = async (rowData: EmployeeData) => {
    try {
      const { id, nameemployee, pass, email, state } = rowData;

      const requestBody = { id, name: nameemployee, password: pass, email };

      await fetch('/api/databaseEmployeeEdit', { // Reemplaza "nombre-de-tu-api" con la ruta correcta de tu API
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const handleDeleteRow = async (id: any) => {
    console.log(id);
    try {
      await fetch('/api/databaseemployee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, state: 0 }), // Assuming you want to set state to 0 when deleting
      });
      fetchData();
    } catch (error) {
      console.error('Error al actualizar el estado en la base de datos desde el cliente:', error);
    }
  };

  const handleReactivateRow = async (id: any) => {
    try {
      await fetch('/api/dbaux', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, state: 1 }), // Assuming you want to set state to 1 when reactivating
      });
      fetchData();
    } catch (error) {
      console.error('Error al reactivar el estado en la base de datos desde el cliente:', error);
    }
  };

  const fetchData = () => {
    const promises = [
      fetch('/api/databaseemployee').then((response) => response.json()),
    ];

    Promise.all(promises)
      .then((results) => {
        const [result] = results;

        const filteredDataET = result.data.filter((row: { state: number; }) =>
          showStateZero ? row.state === 0 : row.state === 1
        );
        const mappedData = filteredDataET.map((row: { Id: any; Name: any; Password: any; Email: any; state: any; RoleName: any; }) => ({
          id: row.Id,
          nameemployee: row.Name,
          pass: row.Password,
          email: row.Email,
          state: row.state,
          rol: row.RoleName,
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
    fetchData();
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [showStateZero]);

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <div>
        <button
          onClick={() => setShowStateZero(!showStateZero)}
          style={{ backgroundColor: showStateZero ? 'green' : 'red', color: 'white' }}
        >
          {showStateZero ? ' Ver Activos' : 'Ver Inactivos'}
        </button>
      </div>
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
        style={{ background: 'white' }}
      />
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
          }}
        >
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Editar Datos
            </Typography>
            <TextField
              label="Nombre"
              defaultValue={selectedRowData?.nameemployee}
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={(e) => setSelectedRowData({ ...selectedRowData!, nameemployee: e.target.value })}
            />
            <TextField
              label="Correo"
              defaultValue={selectedRowData?.email}
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={(e) => setSelectedRowData({ ...selectedRowData!, email: e.target.value })}
            />
            <TextField
              label="Contraseña"
              type="password"
              defaultValue={selectedRowData?.pass}
              fullWidth
              sx={{ marginBottom: 2 }}
              onChange={(e) => setSelectedRowData({ ...selectedRowData!, pass: e.target.value })}
            />
            <Button variant="contained" onClick={() => handleSaveChanges(selectedRowData!)} sx={{ marginRight: 2 }}>
              Guardar cambios
            </Button>
            <Button variant="contained" onClick={handleCloseModal} color="error">
              Cancelar
            </Button>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
