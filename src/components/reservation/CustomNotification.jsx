import React, { useRef } from 'react';
import { Toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';

const CustomNotification = ({ sala, fecha, horaInicio, horaFin, remaining }) => {
  debugger
  const emojiReserva = "✅";
  const emojiSala = "🚪";
  const emojiFecha = "📅";
  const emojiHora = "🕒";
  const emojiRestantes = "⏳";
  const textToCopy = `${emojiReserva} Reserva creada!\n${emojiSala} Sala: ${sala}\n${emojiFecha} Fecha: ${fecha}\n${emojiHora} Hora: ${horaInicio} - ${horaFin}${remaining && parseInt(remaining) > 1 ? `\n${emojiRestantes} Horas restantes: ${remaining}` : ''}`;  
  // const textToCopy = `${emojiReserva} Reserva creada!\n${emojiSala} Sala: ${sala}\n${emojiFecha} Fecha: ${fecha}\n${emojiHora} Hora: ${horaInicio} - ${horaFin}`;
  const textAreaRef = useRef(null);

  const copyToClipboard = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
  };

  const style = {
    whiteSpace: 'pre-line',
  };

  return (
    <div>
      <div style={style}>{textToCopy}</div>
      <textarea
        ref={textAreaRef}
        style={{ position: 'absolute', left: '-9999px' }}
        defaultValue={textToCopy}
      />
        <Button
        variant="contained"
        color="primary"
        startIcon={<FileCopyIcon />}
        onClick={copyToClipboard}
      >
        Copiar 
      </Button>
      {/* <button onClick={copyToClipboard}>Copiar al portapapeles</button> */}
    </div>
  );
};

export default CustomNotification;