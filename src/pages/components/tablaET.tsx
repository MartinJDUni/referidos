import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface RowData {
  id: number;
  nombre_empleado: string;
  rol_empleado: string;
  total_tareas: number;
  tareas_aceptadas: number;
  state: number;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editingRowId, setEditingRowId] = React.useState<any>(null);
  const [editedFields, setEditedFields] = React.useState<any>({});
  const [rowSelectionModel, setRowSelectionModel] = React.useState<any[]>([]);

  const getProgressColor = (value: number) => {
    if (value <= 30) {
      return {
        background: '#E53935', // Rojo para 0-30
        bar: '#C62828',
      };
    } else if (value < 80) {
      return {
        background: '#FFC107', // Amarillo para 30-99
        bar: '#FFA000',
      };
    } else {
      return {
        background: '#4CAF50', // Verde para >100
        bar: '#2E7D32',
      };
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: 'pointer', marginRight: '8px', color: '#39A7FF' }}
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
    { field: 'id', headerName: 'Id', width: 50 },
    { field: 'nombre_empleado', headerName: 'Nombre', width: 150 },
    { field: 'rol_empleado', headerName: 'Tarea', width: 150 },
    { field: 'total_tareas', headerName: 'Meta', width: 80 },
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
                width: '100%',
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

  const handleEditRow = (id: any) => {
    setEditingRowId(id);
    setOpen(true);

    const editedRow = data.find((row) => row.id === id);
    setEditedFields(editedRow);
  };

  const handleEditClose = () => {
    setOpen(false);
    setEditingRowId(null);
    setEditedFields({});
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/databaseETedit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingRowId,
          goal: editedFields.goal,
          start: editedFields.start,
          final: editedFields.final,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update data: ${response.statusText}`);
      }

      setData((prevData) =>
        prevData.map((row) =>
          row.id === editingRowId ? { ...row, ...editedFields } : row
        )
      );

      handleEditClose();

      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleReactivateRow = async (id: any) => {
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

  const handleDeleteRow = async (id: any) => {
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

  const fetchData = React.useCallback(() => {
    fetch('/api/databaseET')
      .then((response) => response.json())
      .then((resultET) => {
        const mappedDataET = resultET.data.map((row: any) => ({
          id: row.id,
          nombre_empleado: row.nombre_empleado,
          rol_empleado: row.rol_empleado,
          total_tareas: row.total_tareas,
          tareas_aceptadas: (row.tareas_aceptadas / (row.total_tareas / 0.8)) * 100,
          state: row.state,
        }));
        console.log(resultET.data);
        setData(mappedDataET);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchData();
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  },);

  return (
    <Box sx={{ height: 520, width: '100%' }}>
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
