const express = require('express');
require('dotenv').config();
const app = express();
const path = require("path");
const PORT = process.env.PORT || 9000;
const stuffRoutes = require('./site/router');
const pool = require('./site/pool');
const sequelize = require('./site/models/index.js');
require('./site/models/user');
require('./site/models/connect');
app.use(express.json());
app.use('/api', stuffRoutes);

app.use((req, res, next) => {
  // console.log('Fichier demandé :', req.url);
  // console.log('Méthode HTTP :', req.method);
  next();
});


async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });
    // await sequelize.sync({ alert: true }); A REMETTRE POUR LA PROD
    console.log('The table for the User model was just (re)created!');
    // You can also sync models here if needed
    // await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDBConnection();



// autorise l'accès aux fichiers statiques
app.use(express.static(path.join(__dirname, 'site')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "site",  "index2.html"));
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:9000");
});