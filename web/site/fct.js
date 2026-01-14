import sequelize from './models/index.js';


async function majDb(retry = 5) {
  while (retry > 0) {
    try {
      await sequelize.authenticate();
      console.log('Connection good.');
      await sequelize.sync({ altert: true });
    // await sequelize.sync({ alert: true }); A REMETTRE POUR LA PROD
      console.log('la table a ete mise a jour avec succes.');
      break;
    } catch (error) {
      retry -= 1;
      await new Promise(res => setTimeout(res, 5000));
      continue;
    }
  
  }
}

export { majDb };

