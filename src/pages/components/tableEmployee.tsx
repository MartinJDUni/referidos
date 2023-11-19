import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);

  const columns = [
    {
      field: 'actions', headerAlign: 'center', align: 'center',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: 'pointer', marginRight: '8px' }}
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
              style={{ cursor: 'pointer' }}
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

  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleEditRow = (id) => {
    // Implementa la lógica para editar la fila con el ID proporcionado
    console.log('Editar fila con ID:', id);
  };

  const handleDeleteRow = async (id) => {
    console.log(id);
    try {
      await fetch('/api/databaseemployee', {
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

  const handleReactivateRow = async (id) => {
    try {
      await fetch('/api/dbaux', {
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

  const fetchData = () => {
    const promises = [
      fetch('/api/databaseemployee').then((response) => response.json()),
    ];


    Promise.all(promises)
      .then((results) => {
        const [result] = results;

        const filteredDataET = result.data.filter((row) =>
          showStateZero ? row.state === 0 : row.state === 1
        );
        const mappedData = filteredDataET.map((row) => ({
          id: row.Id, // Cambia 'Id' a 'id'
          nameemployee: row.Name,
          pass: row.Password, // Cambia 'Id' a 'id'
          email: row.Email,
          state: row.state, // Cambia 'Id' a 'id'
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
        <button onClick={() => setShowStateZero(!showStateZero)}>
          {showStateZero ? ' Ver Activos' : 'Ver no activo'}
        </button>
      </div>
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
      />
    </Box>
  );
}
