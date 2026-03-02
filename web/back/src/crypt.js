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
  try {
    if (!text) throw new Error("No text provided");

    const parts = text.split(':');
    if (parts.length !== 2) throw new Error("Text format invalid, expected iv:encrypted");

    const [ivHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    if (iv.length !== 16) throw new Error("Invalid IV length, must be 16 bytes");

    const key = crypto.createHash('sha256').update(secret_chat).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted; // <-- ne pas oublier de retourner
  } catch(err) {
    console.log("error decrypt:", err);
    return null;
  }
}