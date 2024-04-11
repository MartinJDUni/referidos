import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface EditedFields {
  goal?: string; // O el tipo correcto para el campo goal
  start?: Date;
  final?: Date;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState<any[]>([]); // Aquí puedes especificar el tipo de tus datos en lugar de 'any'
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editingRowId, setEditingRowId] = React.useState(null);
  const [editedFields, setEditedFields] = React.useState<EditedFields>({});
  const [selectionModel, setSelectionModel] = React.useState<any[]>([]);

  const getProgressColor = (value: number) => {
    if (value <= 30) {
      return {
        background: '#E53935', // Rojo para 0-30
        bar: '#C62828',
      };
    } else if (value < 100) {
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

  const columns = [
    {
      field: 'actions',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      sortable: false,
      renderCell: (params: { row: { id: React.SetStateAction<null>; state: number; }; }) => (
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
    { field: 'Ename', headerName: 'Nombre', width: 150 },
    { field: 'Tname', headerName: 'Tarea', width: 150 },
    { field: 'goal', headerName: 'Meta', width: 80 },
    {
      field: 'TaskCount',
      headerName: 'Completados',
      headerAlign: 'center',
      align: 'center',
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
                borderRadius: 4,
                backgroundColor: background,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: bar,
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
              {`${params.value.toFixed(2)}%`}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'start',
      headerName: 'Fecha de inicio',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      valueFormatter: (params: { value: string | number | Date; }) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
    },
    {
      field: 'final',
      headerName: 'Fecha de final',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      valueFormatter: (params: { value: string | number | Date; }) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
    },
    { field: 'state', headerName: 'Estado', width: 100 },
  ];

  const handleEditRow = (id: React.SetStateAction<null>) => {
    setEditingRowId(id);
    setOpen(true);

    // Recuperar los valores actuales de la fila y establecerlos en el estado
    const editedRow = data.find((row) => row.id === id);
    setEditedFields(editedRow);
  };

  const handleEditClose = () => {
    setOpen(false);
    setEditingRowId(null);
    setEditedFields({}); // Limpiar campos editados al cerrar el modal
  };

  const handleSaveEdit = async () => {
    try {
      // Make a PUT request to your API endpoint with the updated fields
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

      // Update the local state with the edited fields
      setData((prevData) =>
        prevData.map((row) =>
          row.id === editingRowId ? { ...row, ...editedFields } : row
        )
      );

      // Close the edit modal after successful update
      handleEditClose();

      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
      // Handle error, show notification, etc.
    }
  };
  const handleReactivateRow = async (id: any) => {
    try {
      // Lógica para reactivar la fila
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
      // Lógica para eliminar la fila
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
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection: React.SetStateAction<any[]>) => {
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

      {/* Modal de edición */}
      <Dialog open={open} onClose={handleEditClose} fullWidth maxWidth="xs">
        <DialogTitle>Editar Información</DialogTitle>
        <DialogContent>
          <TextField
            label="Meta"
            fullWidth
            margin="normal"
            style={{ marginBottom: 16 }}
            value={editedFields.goal || ''}
            onChange={(e) => setEditedFields({ ...editedFields, goal: e.target.value })}
          />
          <TextField
            label="Fecha de inicio"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: 16 }}
            value={editedFields.start ? editedFields.start.toISOString().split('T')[0] : ''}
            onChange={(e) => setEditedFields({ ...editedFields, start: new Date(e.target.value) })}
          />
          <TextField
            label="Fecha de final"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: 16 }}
            value={editedFields.final ? editedFields.final.toISOString().split('T')[0] : ''}
            onChange={(e) => setEditedFields({ ...editedFields, final: new Date(e.target.value) })}
          />
          {/* Agrega más campos según sea necesario */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
