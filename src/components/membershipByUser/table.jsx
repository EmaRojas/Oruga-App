import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deleteMembershipByUser, getAllMembershipsByUser } from "../../services/membershipByUser.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle, Grid, Card, CardContent, Typography } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { QrCode } from "./qrCode";

import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es'; // Asegúrate de importar el locale que necesitas

const MembembershipByUserEmpty = {
  "_id": "",
  "endDate": "",
  "client": "",
  "membership": "",
  "billing": "No factura",
  "paymentMethod": "Efectivo"
}

export const TableMembershipsByUser = () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('America/Buenos_Aires');
    const [membershipsByUser, setMembershipsByUser] = useState();
    const [edit, setEdit] = useState(true);
    const [currentMembershipByUser, setCurrentMembershipByUser] = useState(MembembershipByUserEmpty);

    const [sumTotal, setSumTotal] = useState(0);
    const [sumPaid, setSumPaid] = useState(0);
    const [count, setCount] = useState(0);
    const [diffence, setDiffence] = useState(0);

    const [currentPage, setCurrentPage] = useState(0);
    const [selectedMembership, setSelectedMembership] = useState(null);

    useEffect(() => {
      const fetchMembershipTotals = async () => {
        try {
          debugger
          const response = await fetch('https://orugacoworking.vercel.app/api/v1/membershipByUser/totals'); // Reemplaza 'http://your-api-url' por la URL de tu API
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          setSumTotal(data.total);
          setSumPaid(data.paid);
          setCount(data.count);
          setDiffence(data.total - data.paid);
        } catch (error) {
          console.error('There was a problem fetching the data:', error);
          // Puedes manejar el error mostrando un mensaje al usuario o realizando alguna otra acción apropiada.
        }
      };
  
      fetchMembershipTotals();
    }, []); 

    const refreshTable = async () => {
      await getAllMembershipsByUser()
        .then(({ membershipsByUser }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedMemberships = membershipsByUser.map((membership) => {

            
            const fechaUtc = new Date(membership.created);

            const diferenciaHoraria = -3; // ART está UTC-3
            const fechaArgentina = new Date(fechaUtc.getTime() + diferenciaHoraria * 60 * 60 * 1000);
            const day = fechaArgentina.getDate();
            const month = fechaArgentina.getMonth() + 1; // Los meses comienzan en 0, por lo que se suma 1
    

            // Convertir segundos a horas y minutos
            function convertToHoursMinutes(seconds) {
              const hours1 = Math.floor(seconds / 3600);
              const remainingSeconds = seconds % 3600;
              const minutes = Math.floor(remainingSeconds / 60);

              let remTime;
              if (minutes === 0) {
                remTime = hours1.toString();
              } else {
                remTime = hours1.toString() + ':' + minutes.toString();
              }

              return remTime;

            }

            // Convertir segundos a horas y minutos
            const totalSeconds = membership.total_hours; // Valor obtenido de la base de datos
            const remainingSeconds = membership.remaining_hours;

            const totalSecsToHours = convertToHoursMinutes(totalSeconds);
            const remainingSecsToHours = convertToHoursMinutes(remainingSeconds);
            
            return {
              ...membership,
              clientID: membership.clientID ? membership.clientID.full_name : "",
              clientEmail: membership.clientID.email,
              roomID: membership.room,
              membershipHours: totalSecsToHours,
              endDate: day + '/' + month,
              hours: totalSecsToHours,
              totalPaidString: '$' + membership.paid + ' / $ ' + membership.total,
              totalRemainingString: remainingSecsToHours + ' de ' + totalSecsToHours + 'hs',
              pendingString: '$ ' + (membership.total - membership.paid) + ' de $ ' + membership.total,
              billing: membership.billing,
              paymentMethod: membership.paymentMethod,
              created: dayjs(membership.created).format('DD [de] MMMM')
            };
          });
          
          setMembershipsByUser(transformedMemberships);
        })
        .catch((e) => {
          console.log(e.message);
        });
    
      setCurrentMembershipByUser(MembembershipByUserEmpty);
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
          name: "totalRemainingString",
          label: "Horas disponibles",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
          name: "pendingString",
          label: "Pendiente",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
          name: "billing",
          label: "Factura",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
          name: "paymentMethod",
          label: "Medio de pago",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
          name: "created",
          label: "Fecha de inicio",
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
        page: currentPage,
        rowsPerPage: 10, // Change this to 10, which is one of the default options
        rowsPerPageOptions: [5, 10, 15, 100], // Add this line to include 5 as an option
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
        onChangePage: (currentPage) => {
            setCurrentPage(currentPage);
        },
        onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
            if (rowsSelected.length === 1) {
                setEdit(false);
                const selectedIndex = rowsSelected[0];
                if (membershipsByUser && membershipsByUser[selectedIndex]) {
                    console.log('Selected membership:', membershipsByUser[selectedIndex]);
                    setSelectedMembership(membershipsByUser[selectedIndex]);
                } else {
                    console.error('Selected membership not found. Index:', selectedIndex, 'Total memberships:', membershipsByUser ? membershipsByUser.length : 0);
                    setSelectedMembership(null);
                }
            } else {
                setEdit(true);
                setSelectedMembership(null);
            }
        },
        onRowsDelete: async (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;

            const confirmAction = window.confirm("¿Estás seguro de que deseas eliminar esta membresía? Se elimintarán todas las reservas asociadas.");

            if (confirmAction) {
                try {
                    const deletePromises = data.map(async ({ dataIndex }) => {
                        const membershipToDelete = membershipsByUser[dataIndex];
                        if (membershipToDelete && membershipToDelete._id) {
                            await deleteMembershipByUser(membershipToDelete._id);
                        } else {
                            console.error('Membership not found or invalid:', membershipToDelete);
                        }
                    });

                    await Promise.all(deletePromises);
                    
                    await refreshTable();
                    toast.update(id, { render: "Membresía eliminada", type: "success", isLoading: false, autoClose: 2000 });
                } catch (error) {
                    console.error('Error deleting memberships:', error);
                    toast.update(id, { render: "Error al eliminar membresía", type: "error", isLoading: false, autoClose: 2000 });
                }
            } else {
                console.log("Eliminación de membresía cancelada por el usuario");
                toast.update(id, { render: "Eliminación cancelada", type: "info", isLoading: false, autoClose: 2000 });
            }
            return false; // Prevent default deletion behavior
        }
    };

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

    return (
        <>
            {/* <Grid container style={cardStyle}>
            <Grid item md={2}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13}} gutterBottom>
                    Membresías activas
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: '15px' }}>
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={2}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13}} color="red" gutterBottom>
                    Pendiente
                  </Typography>
                  <Typography variant="h5" color="red" style={{ fontSize: '15px' }}>
                    $ {diffence}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={2}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13}} color="green" gutterBottom>
                    Pagado
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: '15px' }} color="green">
                    $ {sumPaid}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={2}>
              <Card style={cardStyle}>
                <CardContent style={contentStyle}>
                  <Typography sx={{ fontSize: 13}} gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: '15px' }}>
                    $ {sumTotal}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            </Grid>
      <br /> */}
        
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit 
                    isEdit={edit} 
                    setEdit={setEdit} 
                    setMembershipsByUser={setMembershipsByUser} 
                    membershipsByUser={membershipsByUser} 
                    currentMembershipByUser={selectedMembership || MembembershipByUserEmpty} 
                    setCurrentMembershipByUser={setSelectedMembership} 
                />
                <QrCode 
                    isEdit={edit} 
                    setEdit={setEdit} 
                    setMembershipsByUser={setMembershipsByUser} 
                    membershipsByUser={membershipsByUser} 
                    currentMembershipByUser={selectedMembership || MembembershipByUserEmpty} 
                    setCurrentMembershipByUser={setSelectedMembership} 
                />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable className="tabluppercase"
                        title={"MEMBRESÍAS POR CLIENTE"}
                        data={membershipsByUser}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}