import { majDb } from './CreatDB.js';


(async () => {
    await majDb();
    console.log("DB mise à jour avec succès");
})();

console.log("Init DB terminée");