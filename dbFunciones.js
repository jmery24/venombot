
//const { fecha, lugar, hora, cantjugadores } = require('./bot.js');


// Función que inserta un nuevo partido en la base de datos
function insertarPartido(fecha, lugar, hora, cantjugadores) {
  // Abrir la base de datos
  //const db = new sqlite3.Database('mydb.db');
  let db = new sqlite3.Database('futbot.db');

  // Ejecutar la consulta INSERT
  db.run('INSERT INTO partidos (fecha, lugar, hora, cantjugadores) VALUES (?, ?, ?, ?)', [fecha, lugar, hora, cantjugadores], function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha insertado el partido el ${fecha} ${hora} en ${lugar} de ${cantjugadores} jugadores`);
    //client.sendText(message.from, `Partido creado: ${match.date}, ${match.location}, ${match.time}, ${match.players} jugadores.`);
  });

  // Cerrar la base de datos
  db.close();
}
module.exports = { insertarPartido };
