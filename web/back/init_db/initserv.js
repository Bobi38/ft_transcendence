import { majDb } from './CreatDB.js';
import { addDb } from './CreatDB.js';

await majDb();
await addDb();

console.log("Init DB terminée");
process.exit(0);