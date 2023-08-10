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
import { getTodayReservations, deleteReservation } from "../../services/reservation.service";
//https://github.com/gregnb/mui-datatables

const ReservationEmpty = { 
  "_id":"",
  "clientID": {
      "full_name": "",
  },
}

export const Table = () => {

    const [reservations, setReservations] = useState();
    const [edit, setEdit] = useState(true);
    const [currentReservation, setCurrentReservation] = useState(ReservationEmpty);
    
    const refreshTable = async () => {
      await getTodayReservations()
        .then(({ reservations }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedReservations = reservations.map((reservation) => {
    
            return {
              ...reservation,
              clientID: reservation.clientID.full_name || "",
              roomID: reservation.roomID.name,
              total: '$ ' + reservation.paymentID.paid + ' / $ ' +reservation.paymentID.total,
              date: reservation.time + ' - ' + reservation.endTime
            };
          });
          
          setReservations(transformedReservations);
          console.log(reservations);
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
                return value || "";
              },
            },
        },
        {
          name: "date",
          label: "Fecha y hora",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
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
        onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
          if (rowsSelected.length <= 1) {
                setEdit(false)
                //console.log(membershipsByUser[rowsSelected]);
                setCurrentReservation(reservations[rowsSelected]);
                console.log(currentReservation);
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
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setReservations={setReservations} reservations={reservations} currentReservation={currentReservation} setCurrentReservation={setCurrentReservation} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable
                        title={"RESERVAS DEL DÍA"}
                        data={reservations}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}