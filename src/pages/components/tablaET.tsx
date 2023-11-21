import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);

  const getProgressColor = (value) => {
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

  const columns = [
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
              style={{ cursor: 'pointer', color: '#EB455F' }}
              onClick={() => handleDeleteRow(params.row.id)}
            />
          )}
        </div>
      ),
    },
    { field: 'id', headerName: 'Id', width: 50, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' } },
    { field: 'Ename', headerName: 'Nombre', width: 150, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' } },
    { field: 'Tname', headerName: 'Tarea', width: 150, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' } },
    { field: 'goal', headerName: 'Meta', width: 80, headerAlign: 'center', align: 'center', style: { fontWeight: 'bold' } },
    {
      field: 'TaskCount',
      headerAlign: 'center',
      headerName: 'Completados',
      width: 200,
      renderCell: (params) => {
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
      valueFormatter: (params) => {
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
      valueFormatter: (params) => {
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

  const handleEditRow = (id) => {
    console.log('Editar fila con ID:', id);
  };

  const handleReactivateRow = async (id) => {
    try {
      await fetch('/api/databaseReac', {
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

  const handleDeleteRow = async (id) => {
    try {
      await fetch('/api/databaseET', {
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

  const fetchData = () => {
    const promises = [
      fetch('/api/databaseET').then((response) => response.json()),
      fetch('/api/dbC').then((response) => response.json()),
    ];

    Promise.all(promises)
      .then((results) => {
        const [resultET, resultOtherAPI] = results;

        const filteredDataET = resultET.data.filter((row) =>
          showStateZero ? row.state === 0 : row.state === 1
        );

        const mappedDataET = filteredDataET.map((row) => ({
          id: row.Id,
          EmployeeId: row.EmployeeId,
          Ename: row.EmployeeName,
          Tname: row.TaskName,
          goal: row.Goal,
          start: new Date(row.Startdate),
          final: new Date(row.Finaldate),
          state: row.state,
        }));

        const finalData = mappedDataET.map((rowET) => {
          const matchingOtherData = resultOtherAPI.data.find((otherRow) => {
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
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
