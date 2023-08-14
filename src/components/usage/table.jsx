import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
import { getAllUsages } from "../../services/usage.service";
//https://github.com/gregnb/mui-datatables



export const Table = () => {

    const [usages, setUsages] = useState();
    const [edit, setEdit] = useState(true);
    
    const refreshTable = async () => {
      await getAllUsages()
        .then(({ usages }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedUsages = usages.map((usage) => {

            const fechaInicio = new Date(usage.startDateTime);

            const dia = fechaInicio.getUTCDate().toString().padStart(2, '0');
            const mes = (fechaInicio.getUTCMonth() + 1).toString().padStart(2, '0');
            const año = fechaInicio.getUTCFullYear().toString();
            
            const fechaFormateada = `${dia}/${mes}/${año}`;

            const horaInicio = fechaInicio.getUTCHours().toString().padStart(2, '0');
            const minutosInicio = fechaInicio.getUTCMinutes().toString().padStart(2, '0');         
            const horaInicioFormateada = `${horaInicio}:${minutosInicio}`;

            const fechaFin = new Date(usage.endDateTime);
            const horaFin = fechaFin.getUTCHours().toString().padStart(2, '0');
            const minutosFin = fechaFin.getUTCMinutes().toString().padStart(2, '0');         
            const horaFinFormateada = `${horaFin}:${minutosFin}`;

            return {
              ...usage,
              clientID: usage.membershipByUserID.clientID.full_name || "",
              date: fechaFormateada ,
              range: horaInicioFormateada + ' - ' + horaFinFormateada,
              hours: usage.hours
            };
          });
          
          setUsages(transformedUsages);
          console.log(usages);
        })
        .catch((e) => {
          console.log(e.message);
        });
    
    };

    
    useEffect(() => {
        refreshTable();
    }, [])


    const muiCache = createCache({
        key: "mui-datatables",
        prepend: true
    });

    const [responsive, setResponsive] = useState("vertical");



    const columns = [
        {
          name: "clientID",
          label: "Cliente",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
            name: "date",
            label: "Fecha",
            options: {
              filter: true,
              sort: false,
              customBodyRender: (value, tableMeta) => {
                return value || "";
              },
            },
        },
        {
          name: "range",
          label: "Horario",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
      },
      {
            name: "hours",
            label: "Tiempo",
            options: {
              filter: true,
              sort: false,
              customBodyRender: (value, tableMeta) => {
                return value || "";
              },
            },
        },
      ];

    const options = {
        filterType: "dropdown",
        responsive,
        textLabels: {
            body: {
                noMatch: "No se encontraron resultados",
                toolTip: "Sort",
                columnHeaderTooltip: column => `Sort for ${column.label}`
            },
            pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar CSV",
                print: "Imprimir",
                viewColumns: "Ver Columnas",
                filterTable: "Filtro",
            },
            filter: {
                all: "Todo",
                title: "FILTROS",
                reset: "RESTABLECER",
            },
            viewColumns: {
                title: "Mostrar Columna",
                titleAria: "Mostrar/Ocultar columnas tabla",
            },
            selectedRows: {
                text: "fila seleccionada",
                delete: "Eliminar",
                deleteAria: "Eliminar fila",
            },
            downloadOptions: {
                filterOptions: {
                    useDisplayedColumnsOnly: true, // it was true
                    useDisplayedRowsOnly: true, // it was true
                  },
            },
        },
        selectableRows: "none", // Desactivar la opción de selección
        customToolbar: () => null, 
    };

    return (
        <>
            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable className="tabluppercase"
                        title={"CONSUMO DE HORAS"}
                        data={usages}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}