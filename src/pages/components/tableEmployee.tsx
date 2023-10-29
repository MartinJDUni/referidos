import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DataGridPremiumDemo() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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
        { field: 'id', headerName: 'Id', width: 150 },
        { field: 'task', headerName: 'Tarea', width: 200 },
        { field: 'description', headerName: 'Descripcion', width: 200 },
        { field: 'state', headerName: 'Estado', width: 200 },
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

    React.useEffect(() => {
        // Realiza una solicitud GET a tu API para obtener los datos de la base de datos
        fetch('/api/databasetask')
            .then((response) => response.json())
            .then((result) => {
                // Mapea los datos para cambiar la propiedad 'Id' a 'id'
                const mappedData = result.data.map((row) => ({
                    id: row.Id, // Cambia 'Id' a 'id'
                    task: row.Name,
                    description: row.Descrition, // Cambia 'Id' a 'id'
                    state: row.state, // Mantén 'Name' como 'name'
                    // Agrega otras propiedades si es necesario
                }));
    
                setData(mappedData); // Establece los datos mapeados en el estado
                setLoading(false); // Indica que la carga ha terminado
            })
            .catch((error) => {
                console.error('Error al obtener datos de la base de datos:', error);
                setLoading(false); // Maneja el error
            });
    }, []);

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
