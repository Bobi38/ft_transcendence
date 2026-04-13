import { validator } from '../index_p.js';

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
    return { valid: true };
  }

  static validateMaj_Password(data) {
    const token = data.cookies.temp;
    const new_psd = data.body.new_psd;
    if (!token || !new_psd) {
      return { valid: false, message: 'Missing fields', code : 400 };
    }
    if (new_psd.length > 128) {
      return { valid: false, message: 'Password too long', code: 400 };
    }
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