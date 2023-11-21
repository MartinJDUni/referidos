import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

export default function DataGridPremiumDemo({ onClickVerComentarios }) {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Obtener userId de localStorage al cargar la página
        const storedUserId = localStorage.getItem('userId');
        console.log("userId al cargar la página:", storedUserId);
        setUserId(storedUserId);
    }, []);

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
        if (!userId) {
            console.log("no hay id: ",userId);
            return;
        }
    
        fetch(`/api/dbTaskPer?employeeId=${userId}`)
            .then((response) => response.json())
            .then((result) => {
                const mappedData = result.data.map((row) => ({
                    id: row.Id,
                    client: row.ClientName,
                    statetask: row.StateTaskName,
                    start: new Date(row.date),
                    state: row.state,
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
