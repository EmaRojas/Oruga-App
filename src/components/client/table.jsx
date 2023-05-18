import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deleteClient, getAll } from "../../services/client.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { Client } from "../../models/model";
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables


export const Table = () => {

    const [clients, setClients] = useState()
    const [edit, setEdit] = useState(true);
    const [currentUser, setCurrentUser] = useState(Client);

    const refreshTable =async () => {    
        await getAll()
        .then(({ clients }) => {
            setClients(clients)
        })
        .catch((e) => {
            console.log(e.message)
        })
        
        setCurrentUser(Client);

        setEdit(true);
    }

    
    useEffect(() => {
        getAll()
            .then(({ clients }) => {
                setClients(clients)
            })
            .catch((e) => {
                console.log(e.message)
            })
    }, [])

    const muiCache = createCache({
        key: "mui-datatables",
        prepend: true
    });

    const [responsive, setResponsive] = useState("vertical");

    const columns = [
        {
            name: "full_name",
            label: "Nombre",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "email",
            label: "Email",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "cuit",
            label: "C.U.I.T.",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "phone",
            label: "Telefono",
            options: {
                filter: true,
                sort: true,
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
                setCurrentUser(clients[rowsSelected])
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentUser(Client);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentUser(Client);
            }
        },
        onTableChange: (action, state) => {
            return false;
        },
        onRowsDelete: (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;

            data.forEach(async ({ index }) => {
                const { _id } = clients[index];
                await deleteClient(_id);
                refreshTable();
            });

            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
        }
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setClients={setClients} clients={clients} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable
                        title={"CLIENTES"}
                        data={clients}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}