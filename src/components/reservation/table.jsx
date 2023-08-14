import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
import { getAllReservations, getAllReservationsFilter, deleteReservation, getStats } from "../../services/reservation.service";
//https://github.com/gregnb/mui-datatables
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import "dayjs/locale/es";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { SetMealRounded } from "@mui/icons-material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


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
    const [stats, setStats] = useState(null);
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'week');

    const [start, setStart] = useState(today);
    const [end, setEnd] = useState(tomorrow);

    const handleDateChange = (start, end) => {
      setStart(start);
      console.log(start);
      setEnd(end);
      console.log(end);
      refreshTableFilter(start, end);
    };

    const refreshTableFilter = async () => {
      await getAllReservationsFilter(start, end)
        .then(({ reservations }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedReservations = reservations.map((reservation) => {
    
            return {
              ...reservation,
              clientID: reservation.clientID.full_name || "",
              roomID: reservation.roomID.name,
              total: '$ ' + reservation.paymentID.paid + ' / $ ' +reservation.paymentID.total,
              date: reservation.date + ' ' + reservation.time + ' - ' + reservation.endTime
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


    // const refreshTable = async () => {
    //   await getAllReservationsFilter()
    //     .then(({ reservations }) => {
    
    //       // Transformar los datos para la exportación CSV
    //       const transformedReservations = reservations.map((reservation) => {
    
    //         return {
    //           ...reservation,
    //           clientID: reservation.clientID.full_name || "",
    //           roomID: reservation.roomID.name,
    //           total: '$ ' + reservation.paymentID.paid + ' / $ ' +reservation.paymentID.total,
    //           date: reservation.date + ' ' + reservation.time + ' - ' + reservation.endTime
    //         };
    //       });
          
    //       setReservations(transformedReservations);
    //       console.log(reservations);
    //     })
    //     .catch((e) => {
    //       console.log(e.message);
    //     });
    
    //   setCurrentReservation(ReservationEmpty);
    //   setEdit(true);
    // };

    
     useEffect(() => {
         refreshTableFilter();
         async function fetchData() {
          const response = await getStats(start, end);
          setStats(response);
      }

      fetchData();
     }, [start, end])

     useEffect(() => {
     console.log(stats);
      }, [stats]);

    const muiCache = createCache({
        key: "mui-datatables",
        prepend: true
    });

    const [responsive, setResponsive] = useState("vertical");

    const cardStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '130px',
      marginLeft: '15px' // Ajusta la altura según tus necesidades
    };
    
    const contentStyle = {
      textAlign: 'center', // Otras propiedades de estilo según sea necesario
    };

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
            label: "Pagado / Total",
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
                refreshTableFilter();
            });

            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
        }
    };

    return (
        <>
        <Grid container style={cardStyle}>
          <form>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DemoItem components={['DatePicker']}>
                  <DatePicker label="Inicio"
                    name="start"
                    value={start}
                    onChange={(newStart) => handleDateChange(newStart, end)}
                  />
                </DemoItem>
              </LocalizationProvider>

            </Grid>
            <br />
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DemoItem components={['DatePicker']}>
                  <DatePicker label="Fin"
                    name="end"
                    value={end}
                    onChange={(newEnd) => handleDateChange(start, newEnd)}
                  />
                </DemoItem>
              </LocalizationProvider>
            </Grid>
          </form>

          <Grid item md={1}>
        <Card style={cardStyle}>
            <CardContent style={contentStyle}>
                <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
                    Reservas
                </Typography>
                <Typography variant="h5" style={{ fontSize: '14px' }} component="div">
                    {stats ? stats.totalReservations : 'Cargando...'}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
    {stats &&
        stats.roomStats.map((roomStat, index) => (
            <Grid item md={1} key={index}>
                <Card style={cardStyle}>
                    <CardContent style={contentStyle}>
                        <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
                            {roomStat.roomName}
                        </Typography>
                        <Typography variant="h5" style={{ fontSize: '14px' }} component="div">
                            {roomStat.count}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ))}

        </Grid>
            <br />


            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setReservations={setReservations} reservations={reservations} currentReservation={currentReservation} setCurrentReservation={setCurrentReservation} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable
                        title={"RESERVAS"}
                        data={reservations}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}