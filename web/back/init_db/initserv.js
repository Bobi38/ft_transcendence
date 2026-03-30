import { majDb } from './CreatDB.js';
import { addDb } from './CreatDB.js';


(async () => {
    await majDb();
    console.log("DB mise à jour avec succès");
    await addDb();
    console.log("DB ajoutée avec succès");
})();

console.log("Init DB terminée");