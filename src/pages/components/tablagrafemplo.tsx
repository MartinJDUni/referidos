import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);

  const [userId, setUserId] = useState(null);

  const getProgressColor = (value: number) => {
    if (value <= 30) {
      return {
        background: '#E53935', // Rojo para 0-30
        bar: '#C62828',
      };
    } else if (value <= 60) {
      return {
        background: '#FFC107', // Amarillo para 30-60
        bar: '#FFA000',
      };
    } else {
      return {
        background: '#4CAF50', // Verde para >60
        bar: '#2E7D32',
      };
    }
  };

  useEffect(() => {
    // Obtener userId de localStorage al cargar la página
    const storedUserId = localStorage.getItem('userId');
    console.log("userId al cargar la página:", storedUserId);
    setUserId(storedUserId);
  }, []);

  const columns = [
    { field: 'id', headerName: 'Id', width: 50, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' }},
    { field: 'Tname', headerName: 'Tarea', width: 150, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' } },
    { field: 'goal', headerName: 'Meta', width: 80, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' } },
    {
      field: 'TaskCount',
      headerAlign: 'center',
      headerName: 'Completados',
      width: 200,
      renderCell: (params: { value: number; }) => {
        const { background, bar } = getProgressColor(params.value || 0);

        return (
          <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={params.value || 0}
              sx={{
                width: '100%',
                height: 20,
                borderRadius: 4, // Bordes redondeados
                backgroundColor: background,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: bar,
                },
              }}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginLeft: 1, fontWeight: 'bold' }}
            >
              {`${params.value.toFixed(2)}%`}
            </Typography>
          </Box>
        );
      },
      style: { fontWeight: 'bold' },
    },
    {
      field: 'start',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Fecha de inicio',
      width: 150,
      valueFormatter: (params: { value: string | number | Date; }) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
      style: { fontWeight: 'bold' },
    },
    {
      field: 'final',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Fecha de final',
      width: 150,
      valueFormatter: (params: { value: string | number | Date; }) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
      style: { fontWeight: 'bold' },
    },
    { field: 'state', headerName: 'Estado', width: 100, headerAlign: 'center', align: 'center', hide: !showStateZero, style: { fontWeight: 'bold' } },
  ];

  const [selectionModel, setSelectionModel] = React.useState([]);

  const fetchData = () => {
    const promises = [
      fetch(`/api/dbprogres?employeeId=${userId}`).then((response) => response.json()),
      fetch('/api/dbC').then((response) => response.json()),
    ];

    Promise.all(promises)
      .then((results) => {
        const [resultET, resultOtherAPI] = results;

        const filteredDataET = resultET.data.filter((row: { state: number; }) =>
          showStateZero ? row.state === 0 : row.state === 1
        );

        const mappedDataET = filteredDataET.map((row: { Id: any; EmployeeId: any; EmployeeName: any; TaskName: any; Goal: any; Startdate: string | number | Date; Finaldate: string | number | Date; state: any; }) => ({
          id: row.Id,
          EmployeeId: row.EmployeeId,
          Ename: row.EmployeeName,
          Tname: row.TaskName,
          goal: row.Goal,
          start: new Date(row.Startdate),
          final: new Date(row.Finaldate),
          state: row.state,
        }));

        const finalData = mappedDataET.map((rowET: { EmployeeId: any; goal: number; }) => {
          const matchingOtherData = resultOtherAPI.data.find((otherRow: { EmployeeId: any; }) => {
            return otherRow.EmployeeId === rowET.EmployeeId;
          });

          const taskCount = matchingOtherData?.TaskCount || 0;
          const goal = rowET.goal || 1;

          return {
            ...rowET,
            TaskCount: (taskCount / goal) * 100,
            TaskIds: matchingOtherData?.TaskIds || [],
          };
        });

        setData(finalData);
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 400, width: '100%' }}>
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
          getRowId={(row) => row.id}
        />
      </Box>
    </ThemeProvider>
  );
}
