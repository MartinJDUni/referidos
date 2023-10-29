import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DataGridPremiumDemo() {
    const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100,
        editable: true,
        visibleFields: [
            'commodity',
            'quantity',
            'filledQuantity',
            'status',
            'isFilled',
            'unitPrice',
            'unitPriceCurrency',
            'subTotal',
            'feeRate',
            'feeAmount',
            'incoTerm',
        ],
    });

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
                        onClick={() => handleEditRow(params.id)}
                    />
                    <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteRow(params.id)}
                    />
                </div>),
        },
        { field: 'id', headerName: 'Id', width: 150 },
        { field: 'commodity', headerName: 'Commodity', width: 200 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        // Agrega las columnas que deseas mostrar aquí
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

    return (
        <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid
                {...data}
                loading={loading}
                selectionModel={selectionModel}
                onSelectionModelChange={(newSelection) => {
                    setSelectionModel(newSelection);
                }}
                columns={columns}
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
