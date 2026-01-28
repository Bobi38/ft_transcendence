// import crypto from 'crypto';

// const algorithm = 'aes-256-cbc';
// const salt = 'salt123'; // idéalement stocké ailleurs
// const key = crypto.scryptSync('sec', salt, 32);
// const iv = crypto.randomBytes(16);

// const text = "Je suis la copain";

// const cipher = crypto.createCipheriv(algorithm, key, iv)
// const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

// console.log("encrypt ", encryptedText);

// const decipher = crypto.createDecipheriv(algorithm, key, iv);
// const decryptext = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

// console.log("decrpyt " , decryptext);
// 

// const text = "Master of puppets I'm pulling your strings...";
// const password = 'sec';

// const encrypted = encryptText(text, password);
// console.log(encrypted);

// const decrypted = decryptText(encrypted, password);
// console.log(decrypted);


// function getKey(password) {
//   return crypto.scryptSync(password, salt, 32);
// }

// // On crypte notre texte
// function encryptText(text, password) {
//   const iv = crypto.randomBytes(16);
//   const key = getKey(password);

//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');

//   return {
//     iv: iv.toString('hex'),
//     content: encrypted
//   };
// }


// function decryptText(encryptedData, password) {
//   const iv = Buffer.from(encryptedData.iv, 'hex');
//   const key = getKey(password);

//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');

//   return decrypted;
// }

// export {encryptText};
// export {decryptText};

import {Buffer } from 'node:buffer';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'node:crypto';

const ke = scryptSync('se', '123', 32);
console.log(ke);
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-256-gcm', ke, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-256-gcm', ke, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(ciphertext);
console.log(receivedPlaintext);
