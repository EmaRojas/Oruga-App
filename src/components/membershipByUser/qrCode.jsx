import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, InputAdornment, InputLabel, OutlinedInput, Slider, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup, Select, MenuItem } from '@mui/material';
import "dayjs/locale/es";
import dayjs from 'dayjs';
import { createMembershipByUser, getAllMembershipsByUser, consumeHours, updateMembershipByUser } from '../../services/membershipByUser.service';
import { DatePicker } from '@mui/x-date-pickers';
import { set } from 'react-hook-form';
import { useForm } from '../../hooks/useForm';
import QRCode from 'qrcode.react';

import { DateTimePicker } from '@mui/x-date-pickers';
import { getMembershipByEmail } from '../../services/membershipByUser.service';


const MembembershipByUserEmpty = {
    "_id": "",
    "endDate": "",
    "client": "",
    "membership": "",
    "billing": "No factura",
    "paymentMethod": "Efectivo"
}


export const QrCode = ({ isEdit, setEdit, setMembershipsByUser, currentMembershipByUser, setCurrentMembershipByUser }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [client, setClient] = useState({});
    const [clientEmail, setClientEmail] = useState('');

    const getClientInfo = async (event, value) => {
    debugger
    // console.log(currentMembershipByUser);
    // console.log("e");
    // const { memberships } = await getMembershipByEmail(currentMembershipByUser.clientEmail);
    // console.log("xd");


        debugger
        setClientEmail(currentMembershipByUser.clientEmail);
        console.log(clientEmail);
        console.log("e");


    }

    const reset = () => {
        setdisabledButton(false);
        setFormSubmitted(false);
        setEdit(true);
        setModal(false);
        setCurrentMembershipByUser(MembembershipByUserEmpty);

        
    }

    const handleOpen = () => {
        setModal(true);
        getClientInfo();
    }

    const handleClose = () => {
        setModal(false);
        reset();
    }

    const handleSubmit = () => {
        setModal(false);
        reset();
    }
    const confirmationUrl = `https://www.orugacoworking.com.ar/verificarCredencial/index.php?email=${clientEmail}`;

    return (
        <>
            <Button disabled={isEdit} onClick={handleOpen}>VER QR </Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography hidden={!isEdit} color='primary.main' sx={{ ml: 1 }}>QR</Typography>
                        <Typography hidden={isEdit} color='primary.main' sx={{ ml: 1 }}>Credencial de {currentMembershipByUser.clientID} </Typography>
                        <Divider />
                    </DialogTitle>
 
                    <DialogContent>
                        <Grid container justifyContent="center" alignItems="center">
                        <QRCode value={confirmationUrl} size={256}/>


                        </Grid>


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            <Typography color='primary.main' sx={{ ml: 1 }}>Cancelar</Typography>
                        </Button>

                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
};
