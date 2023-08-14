import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deleteClient, getAll } from "../../services/client.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle, Grid, Card, CardContent, Typography} from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables
import { getAllPaymentsFilter, getStats } from "../../services/payment.service";
import "dayjs/locale/es";
import dayjs from 'dayjs';
//https://github.com/gregnb/mui-datatables
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const PaymentEmpty = { 
    "_id": "",
    "client": "",
    "means_of_payment": "",
    "total": "",
    "paid": "",
    "created": ""
}

export const Table = () => {

    const [payments, setPayments] = useState()
    const [edit, setEdit] = useState(true);
    const [currentPayment, setCurrentPayment] = useState(PaymentEmpty);
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'week');

    const [start, setStart] = useState(today);
    const [end, setEnd] = useState(tomorrow);
    const [stats, setStats] = useState(null);

    const refreshTableFilter = async () => {
        await getAllPaymentsFilter(start, end)
          .then(({ payments }) => {
      
            // Transformar los datos para la exportación CSV
            const transformedPayments = payments.map((payment) => {
      
              return {
                ...payment,
                means_of_payment: payment.means_of_payment || "",
                total: payment.total,
                paid: payment.paid,
                created: payment.created,
                client: payment.clientInfo.full_name
              };
            });
            
            setPayments(transformedPayments);
            console.log(payments);
            })
          .catch((e) => {
            console.log(e.message);
          });
      
        setCurrentPayment(PaymentEmpty);
        setEdit(true);
      };

    const handleDateChange = (start, end) => {
        setStart(start);
        console.log(start);
        setEnd(end);
        console.log(end);
        refreshTableFilter(start, end);
      };
    
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
            name: "client",
            label: "Cliente",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "means_of_payment",
            label: "Medio de pago",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "paid",
            label: "Pagado",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "total",
            label: "Total",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "created",
            label: "Fecha y hora",
            options: {
                filter: true,
                sort: false,
            }
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
        },
        onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
            if (rowsSelected.length <= 1) {
                setEdit(false)
                setCurrentPayment(payments[rowsSelected])
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentPayment(PaymentEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentPayment(PaymentEmpty);
            }
        },
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
                {stats && (
        <>
            <Grid item md={1}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
                    Pagos
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: '14px' }}>
                    {stats.totalPayments}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={1}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
                    Pagado
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: '14px' }}>
                    $ {stats.paid}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={1}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: '14px' }}>
                    $ {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {stats.meansOfPaymentStats[0] && Object.entries(stats.meansOfPaymentStats[0]).map(([paymentMethod, count], index) => (
              <Grid item md={1} key={index}>
                <Card style={cardStyle}>
                  <CardContent style={contentStyle}>
                    <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
                      {paymentMethod}
                    </Typography>
                    <Typography variant="h5" style={{ fontSize: '14px' }}>{count}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          <br />
        </>
      )}

            </Grid>
            <br />

            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setPayments={setPayments} payments={payments} currentPayment={currentPayment} setCurrentPayment={setCurrentPayment} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable className="tabluppercase"
                        title={"CLIENTES"}
                        data={payments}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}