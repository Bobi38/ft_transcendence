import {validator} from '../index_p.js';

class AuthDTO {
  static validateLogin(data) {
    const { email, password, host } = data;

    if (!email || !password || !host) {
      return { valid: false, message: 'Missing fields (login)', code : 400 };
    }
    if (email.length > 128 || password.length > 128 || host.length > 128) {
      return { valid: false, message: 'Fields too long', code: 400 };
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
    if (name.length > 128) {
      return { valid: false, message: 'Username too long', code: 400 };
    }
    if (password.length > 128) {
      return { valid: false, message: 'Password too long', code: 400 };
    }
    if (email.length > 128) {
      return { valid: false, message: 'Email too long', code: 400 };
    }
    if (!validator.isEmail(email)) {
      return { valid: false, message: 'Invalid email format', code : 400 };
    }
    return { valid: true };
  }

}

export default AuthDTO;