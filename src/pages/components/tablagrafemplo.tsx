import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default function DataGridPremiumDemo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50 },
    { field: 'nombre_empleado', headerName: 'Nombre', width: 150 },
    { field: 'rol_empleado', headerName: 'Rol', width: 150 },
    { field: 'total_tareas', headerName: 'Meta', width: 80 },
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

  const fetchData = useCallback(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`/api/dbprogres?employeeId=${userId}`)
      .then((response) => response.json())
      .then((resultET) => {
        const mappedDataET = resultET.data.map((row: any) => ({
          id: row.id_empleado,
          nombre_empleado: row.nombre_empleado,
          rol_empleado: row.rol_empleado,
          total_tareas: row.total_tareas,
          aceptadas: row.tareas_aceptadas,
          tareas_aceptadas: row.tareas_aceptadas * 100 / row.total_tareas,
        }));
        setData(mappedDataET);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
      const pollingInterval = setInterval(() => {
        console.log("Intervalo ejecutado");
        fetchData();
      }, 5000);

      return () => {
        clearInterval(pollingInterval);
      };
    }
  }, [userId, fetchData]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 400, width: '100%' }}>
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
          getRowId={(row) => row.id}
        />
      </Box>
    </ThemeProvider>
  );
}
