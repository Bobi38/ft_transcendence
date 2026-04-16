import { initDb } from './CreatDB.js';


(async () => {
    await initDb();
    console.log("DB update with success");
})();

console.log("Init DB end");