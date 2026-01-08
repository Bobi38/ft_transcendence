import sequelize from './models/index.js';


async function majDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection good.');
    await sequelize.sync({ altert: true });
    // await sequelize.sync({ alert: true }); A REMETTRE POUR LA PROD
    console.log('la table a ete mise a jour avec succes.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export { majDb };

