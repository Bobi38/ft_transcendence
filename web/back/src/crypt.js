import fs from 'fs';
import crypto from 'crypto';

const secret_chat = fs.readFileSync('/run/secrets/cle_chat', 'utf-8').trim();

export function encrypt(text) {
  console.log("in crypt ", text);
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secret_chat).digest();

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text) {
  // console.log("decrypt(1) text:",text)
  const [ivHex, encryptedText] = text.split(':');
  // console.log("decrypt(2) ivHex:",ivHex)
  // console.log("decrypt(3) encryptedText:",encryptedText)
  const iv = Buffer.from(ivHex, 'hex');
  // console.log("decrypt(4) iv:",iv)
  const key = crypto.createHash('sha256').update(secret_chat).digest();
  // console.log("decrypt(5) key:", key)

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  // console.log("decrypt(6)")
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  // console.log("decrypt(7)")

  return decrypted;
}