import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const columns = [
    {
      field: 'actions',
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
            style={{ cursor: 'pointer' }}
            onClick={() => handleDeleteRow(params.row.id)}
          />
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

  const handleDeleteRow = (id) => {
    // Implementa la lógica para eliminar la fila con el ID proporcionado
    console.log('Eliminar fila con ID:', id);
  };

  React.useEffect(() => {
    // Realiza una solicitud GET a tu API para obtener los datos de la base de datos "databaseemployee"
    fetch('/api/databaseemployee') // Cambia la ruta a '/api/databaseemployee'
      .then((response) => response.json())
      .then((result) => {
        // Mapea los datos para cambiar la propiedad 'Id' a 'id'
        const mappedData = result.data.map((row) => ({
          id: row.Id, // Cambia 'Id' a 'id'
          nameemployee: row.Name,
          pass: row.Password, // Cambia 'Id' a 'id'
          email: row.Email,
          state: row.state, // Cambia 'Id' a 'id'
          rol: row.RoleName,
          // Agrega otras propiedades si es necesario
        }));

        setData(mappedData); // Establece los datos mapeados en el estado
        setLoading(false); // Indica que la carga ha terminado
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false); // Maneja el error
      });
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
      />
    </Box>
  );
}
