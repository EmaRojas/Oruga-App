import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deleteMembership, getAll, getAllMemberships } from "../../services/membership.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables

const MembershipEmpty = { 
    "_id":"",
    "name": "",
    "hours":"",
    "type": ""
}

export const Table = () => {

    const [memberships, setMemberships] = useState()
    const [edit, setEdit] = useState(true);
    const [currentMembership, setCurrentMembership] = useState(MembershipEmpty);

    const refreshTable =async () => {    
        await getAllMemberships()
        .then(({ memberships }) => {
            setMemberships(memberships)
        })
        .catch((e) => {
            console.log(e.message)
        })
        
        setCurrentMembership(MembershipEmpty);
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
            name: "hours",
            label: "Horas",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "type",
            label: "Tipo",
            options: {
                filter: true,
                sort: false,
            }
        },
  
    ];

    const options = {
        filterType: "dropdown",
        page: 0, // Página inicial (por defecto es la primera, página 0)
        rowsPerPage: 8,
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
                setCurrentMembership(memberships[rowsSelected])
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentMembership(MembershipEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentMembership(MembershipEmpty);
            }
        },
        onRowsDelete: (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;
            const confirmAction = window.confirm("¿Estás seguro de que deseas eliminar la membresía? Se eliminarán membresías de usuario asociadas.");

            if (confirmAction) {
                data.forEach(async ({ index }) => {
                    const { _id } = memberships[index];
                    await deleteMembership(_id);
                    refreshTable();
                });            
            
              toast.update(id, { render: "Eliminado correctamente", type: "success", isLoading: false, autoClose: 2000 });
            } else {
              // El usuario ha cancelado la acción, puedes manejar esto según tus necesidades
              console.log("Eliminación cancelada por el usuario");
              refreshTable(); // Otras acciones que puedas querer realizar en caso de cancelación
            }



            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
        }
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setMemberships={setMemberships} memberships={memberships} currentMembership={currentMembership} setCurrentMembership={setCurrentMembership} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable className="tabluppercase"
                        title={"MEMBRESIAS"}
                        data={memberships}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}