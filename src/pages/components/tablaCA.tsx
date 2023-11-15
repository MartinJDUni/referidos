import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

export default function DataGridPremiumDemo({ onClickVerComentarios }) {
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
    { field: 'client', headerName: 'Cliente', width: 150 },
    { field: 'emp', headerName: 'Empleado', width: 150 },
    { field: 'statetask', headerName: 'Estado', width: 200 },
    {
      field: 'start',
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
    { field: 'state', headerName: 'estado', width: 100 },
    {
      field: 'customAction',
      headerName: 'Ver comentarios',
      width: 200,
      renderCell: (params) => (
        <button onClick={() => onClickVerComentarios(params.row.id)}>
          Ver comentarios
        </button>
      ),
      }
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

  const fetchData = () => {
    fetch('/api/databaseEC')
      .then((response) => response.json())
      .then((result) => {
        const mappedData = result.data.map((row) => ({
          id: row.Id,
          client: row.ClientName,
          emp: row.EmployeeName,
          statetask: row.StateTaskName,
          start: new Date(row.date),
          state: row.state,
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
      />
    </Box>
  );
}
