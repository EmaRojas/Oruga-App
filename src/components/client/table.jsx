import { useEffect } from "react";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { getAll } from "../../services/client.service";
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CreateOrEdit } from "./createOrEdit";

export const Table = () => {

    const [clients, setClients] = useState([])
    const [edit, setEdit] = useState(true);

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
    // const [searchBtn, setSearchBtn] = useState(true);
    // const [downloadBtn, setDownloadBtn] = useState(true);
    // const [printBtn, setPrintBtn] = useState(true);
    // const [viewColumnBtn, setViewColumnBtn] = useState(true);
    // const [filterBtn, setFilterBtn] = useState(true);


    const columns = [
        {
            name: "phone",
            label: "Telefono",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "full_name",
            label: "Nombre",
            options: {
                filter: true,
                sort: false,
            }
        }
    ];

    const options = {
        // search: searchBtn,
        // download: downloadBtn,
        // print: printBtn,
        // viewColumns: viewColumnBtn,
        // filter: filterBtn,
        filterType: "dropdown",
        responsive,
        textLabels: {
            body: {
                noMatch: "Sorry, no matching records found",
                toolTip: "Sort",
                columnHeaderTooltip: column => `Sort for ${column.label}`
            },
            pagination: {
                next: "Next Page",
                previous: "Previous Page",
                rowsPerPage: "Rows per page:",
                displayRows: "of",
            },
            toolbar: {
                search: "Search",
                downloadCsv: "Download CSV",
                print: "Print",
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            filter: {
                all: "All",
                title: "FILTERS",
                reset: "RESET",
            },
            viewColumns: {
                title: "Show Columns",
                titleAria: "Show/Hide Table Columns",
            },
            selectedRows: {
                text: "fila seleccionada",
                delete: "Eliminar",
                deleteAria: "Delete Selected Rows",
            },
        },
        //tableBodyHeight,
        //tableBodyMaxHeight,
        onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
            debugger
            if (rowsSelected.length <= 1) {

                setEdit(false)
            }
            if (rowsSelected.length > 1) {
                setEdit(true)
            }
            if (rowsSelected.length == 0) {
                setEdit(true)
            }

            console.log(rowsSelected);
            console.dir(allRowsSelected);
        },
        onTableChange: (action, state) => {
            // console.log(action);
            // console.dir(state);
        }
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group" sx={{mb:4}}>
               <CreateOrEdit isEdit={edit} setClients={setClients} clients={clients}/>
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