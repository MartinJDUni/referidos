import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

export default function DataGridPremiumDemo({ onClickVerComentarios }: { onClickVerComentarios: (id: number) => void }) {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState<any[]>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50 },
    { field: 'client', headerName: 'Cliente', width: 150 },
    { field: 'emp', headerName: 'Empleado', width: 150 },
    {
      field: 'statetask',
      headerName: 'Estado',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      cellClassName: (params) => {
          switch (params.value) {
              case 'CANCELADO':
                  return 'cancelledCell';
              case 'ACEPTADO':
                  return 'acceptedCell';
              default:
                  return '';
          }
      },
    },
    {
      field: 'start',
      headerName: 'Fecha de inicio',
      width: 150,
      valueFormatter: (params: { value: string | number | Date; }) => {
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
      renderCell: (params: { row: { id: number; }; }) => (
        <button onClick={() => onClickVerComentarios(params.row.id)}>
          Ver comentarios
        </button>
      ),
    }
  ];

  const fetchData = () => {
    const promises = [
      fetch('/api/tablasSegui').then((response) => response.json()),
    ];

    Promise.all(promises)
      .then((results) => {
        const [result] = results;
        console.log(results);

        const filteredDataET = result.data.filter((row: { status: number; }) =>
          showStateZero ? row.status === 0 : row.status === 1
        );
        const mappedData = filteredDataET.map((row: { id: any; ClientName: any; EmployeeName: any; statusTask: any; date: string | number | Date; status: any; }) => ({
          id: row.id,
          client: row.ClientName,
          emp: row.EmployeeName,
          statetask: row.statusTask,
          start: new Date(row.date),
          state: row.status,
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
    <Box sx={{ height: '90%', width: '100%' }}>
      <div style={{padding:'20px'}}>
        <button onClick={() => setShowStateZero(!showStateZero)}>
          {showStateZero ? ' Ver Activos' : 'Ver no activo'}
        </button>
      </div>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        rowSelectionModel={rowSelectionModel}
        components={{
          Toolbar: (props) => (
            <div>
              <GridToolbar {...props} />
            </div>
          ),
        }}
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
