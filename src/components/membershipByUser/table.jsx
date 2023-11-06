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
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables

const MembembershipByUserEmpty = { 
  "_id":"",
  "endDate":"",
  "client":"",
  "membership":""
}

export const TableMembershipsByUser = () => {

    const [membershipsByUser, setMembershipsByUser] = useState();
    const [edit, setEdit] = useState(true);
    const [currentMembershipByUser, setCurrentMembershipByUser] = useState(MembembershipByUserEmpty);

    const [sumTotal, setSumTotal] = useState(0);
    const [sumPaid, setSumPaid] = useState(0);
    const [count, setCount] = useState(0);
    const [diffence, setDiffence] = useState(0);

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
    
            const totalSeconds = membership.remaining_hours; // Valor obtenido de la base de datos

            // Convertir segundos a horas y minutos
            function convertToHoursMinutes(seconds) {
              const hours1 = Math.floor(seconds / 3600);
              const remainingSeconds = seconds % 3600;
              const minutes = Math.floor(remainingSeconds / 60);
              return { hours1, minutes };
            }

            // Convertir segundos a horas y minutos

            const { hours1, minutes } = convertToHoursMinutes(totalSeconds);
            console.log(hours1, minutes);  // Output: 1 30
            
            //var remTime = hours1 + ':' + minutes;

            let remTime;
            if (minutes === 0) {
              remTime = hours1.toString();
            } else {
              remTime = hours1.toString() + ':' + minutes.toString();
            }

            return {
              ...membership,
              clientID: membership.clientID.full_name || "",
              roomID: membership.roomID.name || "",
              membershipHours: membership.membershipID.hours,
              endDate: day + '/' + month,
              hours: remTime,
              totalPaidString: '$' + membership.paid + ' / $ ' + membership.total,
              totalRemainingString: remTime + ' / ' + membership.membershipID.hours,
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
          name: "totalPaidString",
          label: "Pagado",
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
                console.log(membershipsByUser[rowsSelected]);
                setCurrentMembershipByUser(membershipsByUser[rowsSelected]);
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentMembershipByUser(MembembershipByUserEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentMembershipByUser(MembembershipByUserEmpty);
            }
        },
        onRowsDelete: (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;

            data.forEach(async ({ index }) => {
                const { _id } = membershipsByUser[index];
                await deleteMembershipByUser(_id);
                refreshTable();
            });

            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
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
            <Grid container style={cardStyle}>
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
      <br />
        
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setMembershipsByUser={setMembershipsByUser} membershipsByUser={membershipsByUser} currentMembershipByUser={currentMembershipByUser} setCurrentMembershipByUser={setCurrentMembershipByUser} />
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