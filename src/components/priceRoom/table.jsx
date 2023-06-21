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
import { getAllPriceRooms, deletePriceRoom } from "../../services/priceRoom.service";
//https://github.com/gregnb/mui-datatables

const PriceRoomEmpty = { 
    "_id":"",
    "roomID": {
        "name": "",
    },
}

export const TablePriceRoom = () => {

    const [priceRooms, setPriceRooms] = useState();
    const [edit, setEdit] = useState(true);
    const [currentPriceRoom, setCurrentPriceRoom] = useState(PriceRoomEmpty);
    
    const refreshTable = async () => {
      await getAllPriceRooms()
        .then(({ priceRooms }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedPriceRooms = priceRooms.map((priceRoom) => {
    
            return {
              ...priceRoom,
              roomID: priceRoom.roomID.name || "",
              hour: priceRoom.hour,
              price: priceRoom.price,
            };
          });
          
          setPriceRooms(transformedPriceRooms);
        })
        .catch((e) => {
          console.log(e.message);
        });
    
      setCurrentPriceRoom(PriceRoomEmpty);
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
          name: "hour",
          label: "Horas",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta) => {
              return value || "";
            },
          },
        },
        {
          name: "price",
          label: "Precio",
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
                setCurrentPriceRoom(priceRooms[rowsSelected]);
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
                setCurrentPriceRoom(PriceRoomEmpty);
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
                setCurrentPriceRoom(PriceRoomEmpty);
            }
        },
        onRowsDelete: (rowsDeleted) => {
            const id = toast.loading("Eliminando...")
            const { data } = rowsDeleted;

            data.forEach(async ({ index }) => {
                const { _id } = priceRooms[index];
                await deletePriceRoom(_id);
                refreshTable();
            });

            toast.update(id, { render: "Se eliminaron correctamente los registros!", type: "success", isLoading: false, autoClose: 2000 });
        }
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <CreateOrEdit isEdit={edit} setEdit={setEdit} setPriceRooms={setPriceRooms} priceRooms={priceRooms} currentPriceRoom={currentPriceRoom} setCurrentPriceRoom={setCurrentPriceRoom} />
            </ButtonGroup>

            <CacheProvider value={muiCache} mt={5}>
                <ThemeProvider theme={createTheme()}>

                    <MUIDataTable
                        title={"PRECIOS POR SALA"}
                        data={priceRooms}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
}