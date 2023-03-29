const venom = require('venom-bot');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Abrir una conexión con la base de datos
let db = new sqlite3.Database('futbot.db');

// Crear las tablas de la aplicacion si no existen
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS partidos (idpartido INTEGER PRIMARY KEY, fecha TEXT, lugar TEXT, hora TEXT, cantjugadores INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS jugadores (idjugador INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, telefono TEXT, idwhatsapp TEXT, club TEXT, fechaNac TEXT, arquero TEXT, defensa TEXT, delantero TEXT, titular TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS equipos (idequipo INTEGER PRIMARY KEY, idpartido INTEGER, equipo TEXT, idjugador1 INTEGER, idjugador2 INTEGER, idjugador3 INTEGER, idjugador4 INTEGER, idjugador5 INTEGER, idjugador6 INTEGER, idjugador7 INTEGER, idjugador8 INTEGER, idjugador9 INTEGER, idjugador10 INTEGER, idjugador11 INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS resultados (idresultado INTEGER PRIMARY KEY, idpartido INTEGER, idequipo INTEGER, goles INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS configuracion (idconfig INTEGER PRIMARY KEY, dia TEXT, horario TEXT, cancha TEXT, cantjug INTEGER, equipoA TEXT, equipoB TEXT, capitanTel TEXT)');
});

venom
  .create()
  .then((client) => {
    client.onMessage((message) => {
      if (message.body.startsWith('/partido')) {
        // Parseo de message para obtener detalles del partido creado.
        const match = parseMatchDetails(message.body);
        console.log(message.body);
        console.log(match);
        console.log(message.sender.id);
        console.log(message.from);

        let fecha = match.date
        let hora = match.time
        let lugar = match.location
        let cantjugadores = match.players
        db.run('INSERT INTO partidos (fecha, lugar, hora, cantjugadores) VALUES (?, ?, ?, ?)', [fecha, lugar, hora, cantjugadores], function (err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Se ha insertado el partido el ${fecha} ${hora} en ${lugar} de ${cantjugadores} jugadores`);
          client.sendText(message.from, `Partido creado: ${match.date}, ${match.location}, ${match.time}, ${match.players} jugadores.`);
        });

        //db.close();
      } else if (message.body.startsWith('/configuracion')) {
        // Parseo de message para obtener detalles del partido creado.
        const config = parseConfigDetails(message.body);
        console.log(message.body);
        console.log(config);
        console.log(message.sender.id);
        console.log(message.from);

        let dia = config.fdia
        let horario = config.fhorario
        let cancha = config.fcancha
        let cantjug = config.fcantjug
        let equipoA = config.fequipoA
        let equipoB = config.fequipoB
        let capitanTel = config.fcapitanTel

        console.log(equipoB);

        db.all('SELECT * FROM configuracion', (err, rows) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(rows);
          }
        });

        db.all('SELECT * FROM partidos', (err, rows) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(rows);
          }
        });

        db.run('INSERT INTO configuracion (dia, horario, cancha, cantjug, equipoA, equipoB, capitanTel) VALUES (?, ?, ?, ?, ?, ?, ?)', [dia, horario, cancha, cantjug, equipoA, equipoB, capitanTel], function (err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Se creo la configuracion correctamente dia ${dia} ${horario} hs en ${cancha} de ${cantjug} jugadores, equipoA:${equipoA}, equipoB:${equipoB}, capitanTel:${capitanTel}`);
          client.sendText(message.from, `Se creo la configuracion correctamente dia ${dia} ${horario} hs en ${cancha} de ${cantjug} jugadores, equipoA:${equipoA}, equipoB:${equipoB}, capitanTel:${capitanTel}`);

        });
        db.close();
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });

function parseMatchDetails(message) {
  const parts = message.split(' ');
  const date = parts[1];
  const location = parts[2];
  const time = parts[3];
  const players = parseInt(parts[4]);
  return { date, location, time, players };
}

function parseConfigDetails(message) {
  const parts = message.split(' ');
  const fdia = parts[1];
  const fhorario = parts[2];
  const fcancha = parts[3];
  const fcantjug = parseInt(parts[4]);
  const fequipoA = parts[5];
  const fequipoB = parts[6];
  const fcapitanTel = parts[7];
  return { fdia, fhorario, fcancha, fcantjug, fequipoA, fequipoB, fcapitanTel };
}
