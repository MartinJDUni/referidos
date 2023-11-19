import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DataGridPremiumDemo() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showStateZero, setShowStateZero] = React.useState(false);

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: "pointer", marginRight: "8px" }}
            onClick={() => handleEditRow(params.row.id)}
          />
          {params.row.state === 0 ? (
            <React.Fragment>
              {/* Agrega aquí el icono que represente la reactivación */}
              <span
                style={{ cursor: "pointer", marginRight: "8px" }}
                onClick={() => handleReactivateRow(params.row.id)}
              >
                Reactivar
              </span>
            </React.Fragment>
          ) : (
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteRow(params.row.id)}
            />
          )}
        </div>
      ),
    },
    { field: "id", headerName: "Id", width: 50 },
    { field: "Ename", headerName: "Nombre", width: 150 },
    { field: "Tname", headerName: "Tarea", width: 150 },
    { field: "goal", headerName: "Meta", width: 100 },
    { field: "TaskCount", headerName: "Completados", width: 150 },
    {
      field: "start",
      headerName: "Fecha de inicio",
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
    },
    {
      field: "final",
      headerName: "Fecha de final",
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      },
    },
    { field: "state", headerName: "Estado", width: 100, hide: !showStateZero },
  ];

  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleEditRow = (id) => {
    console.log("Editar fila con ID:", id);
  };

  const handleReactivateRow = async (id) => {
    try {
      // Llama a la nueva ruta PUT para actualizar el estado a 1 (reactivar)
      await fetch("/api/databaseReac", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      // Actualiza los datos para reflejar el cambio en la interfaz
      fetchData();
    } catch (error) {
      console.error(
        "Error al reactivar el estado en la base de datos desde el cliente:",
        error
      );
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      // Llama a la nueva ruta PUT para actualizar el estado a 0
      await fetch("/api/databaseET", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      // Actualiza los datos para reflejar el cambio en la interfaz
      fetchData();
    } catch (error) {
      console.error(
        "Error al actualizar el estado en la base de datos desde el cliente:",
        error
      );
    }
  };

  const fetchData = () => {
    const promises = [
      fetch("/api/databaseET").then((response) => response.json()),
      fetch("/api/dbC").then((response) => response.json()),
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
          console.log("Buscando coincidencia para el ID:", rowET.id);

          const matchingOtherData = resultOtherAPI.data.find((otherRow) => {
            console.log(
              "Comparando IDs:",
              otherRow.EmployeeId,
              rowET.EmployeeId
            );
            return otherRow.EmployeeId === rowET.EmployeeId;
          });

          console.log("Datos combinados:", { rowET, matchingOtherData });
          const taskCount = matchingOtherData?.TaskCount || 0;
          const goal = rowET.goal || 1; // Evitar dividir por cero

          return {
            ...rowET,
            TaskCount: (taskCount / goal) * 100,
            TaskIds: matchingOtherData?.TaskIds || [],
          };
        });

        console.log("Datos finales:", finalData);

        setData(finalData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la base de datos:", error);
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
    <Box sx={{ height: 520, width: "100%" }}>
      <div>
        <button onClick={() => setShowStateZero(!showStateZero)}>
          {showStateZero ? " Ver Activos" : "Ver no activo"}
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
          headerName: "Commodity",
          field: "commodity",
        }}
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
