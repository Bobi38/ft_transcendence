const crypto = require('crypto');

const text = "Master of puppets I'm pulling your strings, twisting your mind and smashing your dreams."

// On définit notre algorithme de cryptage
const algorithm = 'aes256';

// Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
var password = 'sec';

// On crypte notre texte
var cipher = crypto.createCipher(algorithm,password);
var crypted = cipher.update(text,'utf8','hex');
crypted += cipher.final('hex');

console.log(crypted);

// On décrypte notre texte
var decipher = crypto.createDecipher(algorithm,password);
var dec = decipher.update(crypted,'hex','utf8');
dec += decipher.final('utf8');

function encryptText(text){
    
}