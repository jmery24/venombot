const venom = require('venom-bot');
const fs = require('fs');

const dbPath = 'database.json';
const db = fs.existsSync(dbPath) ? require(dbPath) : {};

const sqlite3 = require('sqlite3').verbose();

// Abrir una conexión con la base de datos
let db2 = new sqlite3.Database('partidos.db');

// Crear la tabla de partidos si no existe
db2.run('CREATE TABLE IF NOT EXISTS partidos (id INTEGER PRIMARY KEY, fecha TEXT, lugar TEXT, hora TEXT, cantjugadores INTEGER)');

db2.all('SELECT * FROM partidos', [], (err, rows) => {
    if (err) {
     throw err;
}
        rows.forEach((row) => {
    console.log(row.id, row.fecha, row.lugar, row.hora, row.cantjugadores);
    
});
    db2.close();
});


venom
  .create()
  .then((client) => {
    client.onMessage((message) => {
      if (message.body.startsWith('/partido')) {
        // Parse the message to get the match details.
        const match = parseMatchDetails(message.body);
        console.log(message.body);
        console.log(match);
        console.log(message.sender.id);
        console.log(message.from);

        let fecha = match.date
        let hora = match.time
        let lugar = match.location
        let cantjugadores = match.players
        db2.run('INSERT INTO partidos (fecha, lugar, hora, cantjugadores) VALUES (?, ?, ?, ?)', [fecha, lugar, hora, cantjugadores], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Se ha insertado el partido el ${fecha} ${hora} en ${lugar} de ${cantjugadores} jugadores`);
            client.sendText(message.from, `Partido creado: ${match.date}, ${match.location}, ${match.time}, ${match.players} jugadores.`);
          });
          
          db2.close();
        };


        // Store the match in the database.
        //db.matches.push(match);
        //saveDatabase();
       
    });
  })
  .catch((error) => {
    console.log(error);
  });

function parseMatchDetails(message) {
  // Parse the message body to get the match details.
  const parts = message.split(' ');
  const date = parts[1];
  const location = parts[2];
  const time = parts[3];
  const players = parseInt(parts[4]);
  return { date, location, time, players, playersConfirmed: [] };
}

function saveDatabase() {
  // Save the database to disk.
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
 };



