import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

export default function DataGridPremiumDemo({ onClickVerComentarios }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);

  const columns = [
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

  const fetchData = () => {
    const promises = [
      fetch('/api/databaseEC').then((response) => response.json()),
    ];

    Promise.all(promises)
      .then((results) => {
        const [result] = results;

        const filteredDataET = result.data.filter((row) =>
          showStateZero ? row.state === 0 : row.state === 1
        );
        const mappedData = filteredDataET.map((row) => ({
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
