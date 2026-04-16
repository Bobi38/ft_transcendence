import { bcrypt, validator } from '../index_p.js';

class SecuDTO {
  static validateRecoveryPassword(mail) {
    if (!mail) {
      return { valid: false, message: 'Missing fields', code : 400 };
    }
    if (mail.length > 128) {
      return { valid: false, message: 'Email too long', code: 400 };
    }
    if (!validator.isEmail(mail)) {
      return { valid: false, message: 'Invalid email format', code : 400 };
    }
    return { valid: true };
  }

  static validateMail2FA_CheckCode(data) {
    const {code, host} = data;
    if (!code || !host) {
      return { valid: false, message: 'Missing fields', code : 400 };
    }
    if (code.length > 10)
      return { valid: false, message: 'Code fields', code : 400 };
    return { valid: true };
  }

  static validateMaj_Password(req, nameCook) {
    const token = req.cookies[nameCook];
    const new_psd = req.body.new_psd;
    if (!token || !new_psd) {
      return { valid: false, message: 'Missing fields', code : 400 };
    }
    if (new_psd.length > 71) {
      return { valid: false, message: 'Password too long', code: 400 };
    }
    if (new_psd.length < 4) 
      return { valid: false, message: 'Password too short (min: 4 caract)', code: 400 };
    if (!/[A-Z]/.test(new_psd)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter', code: 400 };
    }
    if (!/[0-9]/.test(new_psd)) {
      return { valid: false, message: 'Password must contain at least one number character', code: 400 };
    }
    const Cryp = bcrypt.hash(password, 10)
    if (Cryp.length > 128)
      return { valid: false, message: 'Password too long', code: 400 }; 
    return { valid: true };
  }

  static validateCookie(req, CookieName) {
    const token = req.cookies[CookieName];
    if (!token) {
      return { valid: false, message: 'Missing fields', code : 400 };
    }
    return { valid: true };
  }
}

export default SecuDTO;