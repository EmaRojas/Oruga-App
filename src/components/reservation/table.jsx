import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deleteReservation, getAllReservations } from "../../services/reservation.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables

const ReservationEmpty = { 
    "_id":"",
    "clientID": {
        "full_name": "",
    },
}

export const Table = () => {

    const [reservations, setReservations] = useState()
    const [edit, setEdit] = useState(true);
    const [currentReservation, setCurrentReservation] = useState(ReservationEmpty);

    const formatCurrency = (value) => {
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
            return numberValue.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
        }
        return value;
    };
    
    const refreshTable = async () => {
        await getAllReservations()
          .then(({ reservations }) => {
            // Transformar los datos para la exportación CSV
            const transformedReservations = reservations.map((reservation) => ({
              ...reservation,
              clientID: reservation.clientID.full_name || "",
              roomID: reservation.roomID.name,
              priceRoomID: reservation.priceRoomID.hour,
              total: reservation.paymentID.total,
              paid: reservation.paymentID.paid,

            }));
            setReservations(transformedReservations);
          })
          .catch((e) => {
            console.log(e.message);
          });
      
        setCurrentReservation(ReservationEmpty);
        setEdit(true);
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
          name: "date",
          label: "Fecha",
          options: {
            filter: true,
            sort: false,
          },
        },
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
          name: "roomID",
          label: "Sala",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value;
            },
          },
        },
        {
          name: "time",
          label: "Hora",
          options: {
            filter: true,
            sort: false,
          },
        },
        {
          name: "priceRoomID",
          label: "Horas",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value;
            },
          },
        },
        {
            name: "total",
            label: "Total",
            options: {
              filter: true,
              sort: false,
              customBodyRender: (value, tableMeta) => {
                return formatCurrency(value);
              },
            },
          },
          {
            name: "paid",
            label: "Pagado",
            options: {
              filter: true,
              sort: false,
              customBodyRender: (value, tableMeta) => {
                return formatCurrency(value);
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
        onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
            if (rowsSelected.length <= 1) {
                setEdit(false)
                setCurrentReservation(reservations[rowsSelected])
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentReservation(ReservationEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentReservation(ReservationEmpty);
            }
        },
        onRowsDelete: (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;

            data.forEach(async ({ index }) => {
                const { _id } = reservations[index];
                await deleteReservation(_id);
                refreshTable();
            });

            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
        }
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setReservations={setReservations} reservations={reservations} currentReservation={currentReservation} setReservation={setCurrentReservation} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable
                        title={"SALAS"}
                        data={reservations}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}