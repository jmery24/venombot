const venom = require('venom-bot');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Abrir una conexión con la base de datos
let db = new sqlite3.Database('botvenom.db');


// Crear la tablas de las base de datos si no existen

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS jugadores (idjugador INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, telefono TEXT, idwhatsapp TEXT, club TEXT, fechaNac TEXT, arquero TEXT, defensa TEXT, delantero TEXT, titular TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS partidos (idpartido INTEGER PRIMARY KEY, fecha TEXT, hora TEXT, lugar TEXT, cantjugadores INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS equipos (idequipo INTEGER PRIMARY KEY, idpartido INTEGER, equipo TEXT, idjugador1 INTEGER, idjugador2 INTEGER, idjugador3 INTEGER, idjugador4 INTEGER, idjugador5 INTEGER, idjugador6 INTEGER, idjugador7 INTEGER, idjugador8 INTEGER, idjugador9 INTEGER, idjugador10 INTEGER, idjugador11 INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS resultados (idresultado INTEGER PRIMARY KEY, idpartido INTEGER, idequipo INTEGER, goles INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS configuracion (idconfig INTEGER PRIMARY KEY, dia TEXT, hora TEXT, lugar TEXT, cantjugadores INTEGER, equipoA TEXT, equipoB TEXT, capitanTel TEXT)');
});


venom
  .create()
  .then((client) => {
    client.onMessage((message) => {
      if (message.body.startsWith('/partido')) {
        const msgPartido = parsePartido(message.body);
        console.log(message.body);
        console.log(partido);
        console.log(message.sender.id);
        console.log(message.from);

        let fecha = msgPartido.msgFecha
        let hora = msgPartido.msgHora
        let lugar = msgPartido.msgLugar
        let cantJugadores = msgPartido.msgCantJugadores
        db.run('INSERT INTO partidos (fecha, lugar, hora, cantjugadores) VALUES (?, ?, ?, ?)', [fecha, lugar, hora, cantugadores], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Se ha insertado el partido el ${fecha} ${hora} en ${lugar} de ${cantJugadores} jugadores`);
          });
          client.sendText(message.from, `Partido creado: ${msgPartido.msgFecha}, ${msgPartido.msgLugar}, ${msgPartido.msgHora}, ${msgPartido.msgCantJugadores} jugadores.`);
          db.close();
        };
    });
  })
  .catch((error) => {
    console.log(error);
  });


// funciones de parseo de los mensajes de whatsapp 
function parsePartido(message) {
  const parts = message.split(' ');
  const msgFecha = parts[1];
  const msgLugar = parts[2];
  const msgHora = parts[3];
  const msgCantJugadores = parseInt(parts[4]);
  return { msgFecha, msgLugar, msgHora, msgCantJugadores};
};