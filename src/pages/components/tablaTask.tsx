import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';

interface TaskData {
  id: number;
  task: string;
  description: string;
  status: string;
}

export default function DataGridPremiumDemo() {
  const [data, setData] = useState<TaskData[]>([]); 
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState({ id: null, task: '', description: '' } as unknown as TaskData);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 150,
    },
    {
      field: 'task',
      headerName: 'Tarea',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Descripción',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 200,
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
    </Box>
  );
}
