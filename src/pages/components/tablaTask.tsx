import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Typography, Stack } from '@mui/material';

interface TaskData {
  id: number;
  task: string;
  description: string;
  status: string;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = useState<TaskData[]>([]); 
  const [loading, setLoading] = useState(true);
  const [openSubTaskModal, setOpenSubTaskModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  // Referencias para los campos del formulario
  const subTaskRef = useRef<HTMLInputElement>(null);
  const totalRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 100,
    },
    {
      field: 'task',
      headerName: 'Tarea',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 100,
    },
    {
      field: 'actions',
      headerName: 'Subtareas',
      width: 150,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleOpenSubTaskModal(params.row.id)}
          color="primary"
        >
          <AddIcon />
        </IconButton>
      ),
    },
  ];

  const fetchData = () => {
    fetch('/api/database') 
      .then((response) => response.json())
      .then((result) => {
        const mappedData: TaskData[] = result.data.map((row: any) => ({
          id: row.id, 
          task: row.task,
          description: row.description,
          status: row.status,
        }));

        setData(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la base de datos:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const handleOpenSubTaskModal = (taskId: number) => {
    setCurrentTaskId(taskId);
    setOpenSubTaskModal(true);
  };

  const handleCloseSubTaskModal = () => {
    setOpenSubTaskModal(false);
  };

  const handleSaveSubTask = () => {
    if (currentTaskId === null) return;

    const subTask = subTaskRef.current?.value ?? '';
    const total = Number(totalRef.current?.value ?? 0);
    const status = Number(statusRef.current?.value ?? 1);

    // Validar campos antes de enviar
    if (!subTask || isNaN(total) || isNaN(status)) {
      console.error('Campos no válidos');
      return;
    }

    // Realizar solicitud HTTP POST para guardar la sub tarea
    fetch(`/api/subtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idTask: currentTaskId,
        subTask,
        total,
        status,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al guardar la sub tarea');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Sub tarea guardada exitosamente:', data);
      handleCloseSubTaskModal();
    })
    .catch((error) => {
      console.error('Error al guardar la sub tarea:', error);
    });
  };

  return (
    <Box sx={{ height: 520, width: '100%' }}>
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
      />
      <Modal
        open={openSubTaskModal}
        onClose={handleCloseSubTaskModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Agregar Sub Tarea
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Sub Tarea"
            inputRef={subTaskRef}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Total"
            type="number"
            inputRef={totalRef}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={handleCloseSubTaskModal}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveSubTask}>Guardar</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
