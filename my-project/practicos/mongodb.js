// Proyecto: tracking colleccion de cartas magic 
// usuarios, que tienen mazos, y colecciones de cartas.
// El mazo consisten en un conjunto de 60 cartas, maximo 4 cartas de la misma copia

// El usuario puede agregar cartas a sus colecciones, las cartas pueden estar repetidas
// El usuario puede eliminar cartas a sus colecciones, si tiene mas de una elimina una copia
// El usuario pueden crear mazos
// El usuario pueden listar mazos
// El usuario pueden modificar mazos
// El usuario pueden eliminar mazos
// El usuario puede listar los mazos de todos los usuarios
// El usuario puede listar los mazos de otro usuario
// El usuario puede ver el mazo de otro usuario
// El usuario puede clonar el mazo de otro usuario
// El usuario puede ver que cartas de su mazo no estan en su coleccion
// El usuario puede ver que cartas tiene otro usuario, que le faltan en su mazo
// El usuario peude ver que cartas tiene en su coleccion, que le hacen falta a otro mazo de otro usuario


const { exit } = require('process');

const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = process.argv[2] || process.env.DATABASE_URL;

if (!url) {
  console.error('[ERROR] Please provide a DATABASE_URL environment variable or an argument to the script. Ex: mongodb://mongodb:27017/myapp');
  exit(1);
}

const client = new MongoClient(url);

client.connect(async function(err) {
  assert.equal(null, err);
  console.log("Connected correctly to MongoDB server");

  // Obtiene el nombre de la base de datos;
  const dbName = url.split('/').pop();
  const db = client.db(dbName);

  try {
    const usersCollection = db.collection('users');
    const decksCollection = db.collection('decks');
    const libraryCardCollection = db.collection('library');

    // Limpiar todo
    await usersCollection.deleteMany();
    await decksCollection.deleteMany();
    await libraryCardCollection.deleteMany();

    // Crear Usuarios
    await usersCollection.insertOne({ name: 'Usuario 1', lastname: 'Lastname 1' });
    await usersCollection.insertMany([
      { name: 'Usuario 2', lastname: 'Lastname 1' },
      { name: 'Usuario 3', lastname: 'Lastname 1' },
      { name: 'Usuario 4', lastname: 'Lastname 1' },
      { name: 'Usuario 5', lastname: 'Lastname 2' },
      { name: 'Usuario 6', lastname: 'Lastname 3' },
      { name: 'Usuario 7', lastname: 'Lastname 3' },
      { name: 'Usuario 8', lastname: 'Lastname 3' },
    ]);
    // Eliminar Usuarios
    await usersCollection.deleteOne({ name: 'Usuario 7' });
    await usersCollection.deleteMany({ $or: [{ name: 'Usuario 8' }, { name: 'Usuario 6' }] });
    const userDocs = await usersCollection.find({}).toArray();

    console.log("USERS: " + JSON.stringify(userDocs, null, 2));

    // Buscar Usuario
    const userDoc1 = await usersCollection.findOne({ name: 'Usuario 1' });
    const userDoc2 = await usersCollection.findOne({ name: 'Usuario 2' });

    // Crear Mazos
    await decksCollection.insertMany([
      { name: 'Deck 1' },
      { name: 'Deck 2' },
      { name: 'Deck 3' },
      { name: 'Deck 4' },
    ]);
    await decksCollection.updateMany({}, { $set: { user: userDoc1._id } });
    await decksCollection.updateOne({ name: 'Deck 3' }, { $set: { user: userDoc2._id } });

    const deckDocs = await decksCollection.find({}).toArray();
    console.log("DECKS: " + JSON.stringify(deckDocs, null, 2));

    // Crear Librerias
    await libraryCardCollection.insertMany([
      // User 1
      { card: 'Card 1', user: userDoc1._id ,copies: 1 },
      { card: 'Card 2', user: userDoc1._id ,copies: 1 },
      { card: 'Card 3', user: userDoc1._id ,copies: 1 },
      { card: 'Card 4', user: userDoc1._id ,copies: 1 },
      // User 2
      { card: 'Card 1', user: userDoc2._id ,copies: 1 },
    ]);
    await libraryCardCollection.updateMany({ user: userDoc1._id }, { $inc: { copies: 1 } });
    await libraryCardCollection.updateOne({ user: userDoc2._id }, { $inc: { copies: 3 } });

    const libraryCardUser1Docs = await libraryCardCollection.find({ user: userDoc1._id }).toArray();
    console.log("LIBRARY. USER 1: " + JSON.stringify(libraryCardUser1Docs, null, 2));
    const libraryCardUser2Docs = await libraryCardCollection.find({ user: userDoc2._id }).toArray();
    console.log("LIBRARY. USER 2: " + JSON.stringify(libraryCardUser2Docs, null, 2));

    client.close();
  } catch(error) {
    console.error(error);
    client.close();
  }
});
