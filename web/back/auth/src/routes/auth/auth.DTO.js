import {validator} from '../index_p.js';

class AuthDTO {
  static validateLogin(data) {
    const { email, password, host } = data;

    if (!email || !password || !host) {
      return { valid: false, message: 'Missing fields (login)', code : 400 };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, message: 'Invalid email format' };
    }

    return { valid: true };
  }

  static validateRegister(data) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return { valid: false, message: 'Missing fields (register)', code : 400 };
    }
    if (!validator.isEmail(email)) {
      return { valid: false, message: 'Invalid email format', code : 400 };
    }
    return { valid: true };
  }

}

export default AuthDTO;