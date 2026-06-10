const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.get('/', (req, res) => {
  res.send('Servidor BovTrack funcionando ✅');
});

app.post('/webhook/ttn', (req, res) => {
  console.log('📡 Datos recibidos de TTN:', JSON.stringify(req.body, null, 2));
  
  let datosDispositivo = req.body;
  if (req.body.uplink_message && req.body.uplink_message.decoded_payload) {
    datosDispositivo = req.body.uplink_message.decoded_payload;
  }
  
  const datosParaWeb = {
    lat: datosDispositivo.Latitud,
    lng: datosDispositivo.Longitud,
    altitud: datosDispositivo.Altitud_m,
    velocidad: datosDispositivo.Velocidad_km_h,
    satelites: datosDispositivo.Satelites,
    calidadGPS: datosDispositivo.Calidad_GPS,
    precision: datosDispositivo.Precision,
    fecha_hora: datosDispositivo.Fecha_hora
  };
  
  console.log('🚀 Enviando a la web:', datosParaWeb);
  io.emit('nuevos-datos-gps', datosParaWeb);
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor BovTrack en puerto ${PORT}`);
});