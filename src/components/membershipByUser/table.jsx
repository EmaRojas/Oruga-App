import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { deleteMembershipByUser, getAllMembershipsByUser } from "../../services/membershipByUser.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";
import { ToastContainer, toast } from 'react-toastify';
//https://github.com/gregnb/mui-datatables

const MembershipByUserEmpty = { 
    "_id":"",
    "clientID": {
        "full_name": "",
    },
}

export const TableMembershipsByUser = () => {

    const [membershipsByUser, setMembershipsByUser] = useState();
    const [edit, setEdit] = useState(true);
    const [currentMembershipByUser, setCurrentMembershipByUser] = useState(MembershipByUserEmpty);
    
    const refreshTable = async () => {
      await getAllMembershipsByUser()
        .then(({ membershipsByUser }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedMemberships = membershipsByUser.map((membership) => {
            const dateObj = new Date(membership.endDate);
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1; // Los meses comienzan en 0, por lo que se suma 1
    
            return {
              ...membership,
              clientID: membership.clientID.full_name || "",
              membershipID: membership.membershipID.name,
              endDate: day + '/' + month,
              hours: membership.membershipID.hours,
            };
          });
          
          setMembershipsByUser(transformedMemberships);
        })
        .catch((e) => {
          console.log(e.message);
        });
    
      setCurrentMembershipByUser(MembershipByUserEmpty);
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
          name: "membershipID",
          label: "Membresía",
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
          label: "Consumido / Restante",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
          name: "endDate",
          label: "Finaliza el día",
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
                setCurrentMembershipByUser(membershipsByUser[rowsSelected]);
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentMembershipByUser(MembershipByUserEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentMembershipByUser(MembershipByUserEmpty);
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

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setMembershipsByUser={setMembershipsByUser} membershipsByUser={membershipsByUser} currentMembershipByUser={currentMembershipByUser} setCurrentMembershipByUser={setCurrentMembershipByUser} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable
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