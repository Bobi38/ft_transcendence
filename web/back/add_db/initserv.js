
import { addDb } from './addDb.js';


(async () => {
    console.log("ADD DB en cours...");
    await addDb();
    console.log("DB ajoutée avec succès");
})();

console.log("Init DB terminée");