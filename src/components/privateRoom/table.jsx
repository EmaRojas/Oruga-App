import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deletePrivateRoom, getAllRooms } from "../../services/privateRoom.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables

const PrivateRoomEmpty = { 
    "_id":"",
    "name": "",
    "capacity": ""
}

export const Table = () => {

    const [privateRooms, setPrivateRooms] = useState()
    const [edit, setEdit] = useState(true);
    const [currentPrivateRoom, setCurrentPrivateRoom] = useState(PrivateRoomEmpty);

    const refreshTable =async () => {    
        await getAllRooms()
        .then(({ privateRooms }) => {
            setPrivateRooms(privateRooms)
        })
        .catch((e) => {
            console.log(e.message)
        })
        
        setCurrentPrivateRoom(PrivateRoomEmpty);
        setEdit(true);
    }

    
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
            name: "name",
            label: "Nombre",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "capacity",
            label: "Capacidad",
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
                setCurrentPrivateRoom(privateRooms[rowsSelected])
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentPrivateRoom(PrivateRoomEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentPrivateRoom(PrivateRoomEmpty);
            }
        },
        onRowsDelete: (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;

            data.forEach(async ({ index }) => {
                const { _id } = privateRooms[index];
                await deletePrivateRoom(_id);
                refreshTable();
            });

            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
        }
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setPrivateRooms={setPrivateRooms} privateRooms={privateRooms} currentPrivateRoom={currentPrivateRoom} setCurrentPrivateRoom={setCurrentPrivateRoom} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable className="tabluppercase"
                        title={"SALAS"}
                        data={privateRooms}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}