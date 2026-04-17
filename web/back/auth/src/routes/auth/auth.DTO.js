import {validator, bcrypt} from '../index_p.js';

class AuthDTO {
  static validateLogin(data) {
    const { email, password, host } = data;

    if (!email || !password || !host) {
      return { valid: false, message: 'Missing fields (login)', code : 400 };
    }
    if (email.length > 128 || password.length > 128) {
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
    if (name.length > 64) {
      return { valid: false, message: 'Username too long', code: 400 };
    }
    if (password.length > 71) {
      return { valid: false, message: 'Password too long', code: 400 };
    }
    if (email.length > 128) {
      return { valid: false, message: 'Email too long', code: 400 };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name))
      return {valid: false,message: 'Username can only contain letters, numbers and underscores',code: 400};
    if (!validator.isEmail(email))
      return { valid: false, message: 'Invalid email format', code : 400 };
    if (password.length < 4) 
      return { valid: false, message: 'Password too short (min: 4 caract)', code: 400 };
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter', code: 400 };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number character', code: 400 };
    }
    const Cryp = bcrypt.hash(password, 10)
    if (Cryp.length > 128)
      return { valid: false, message: 'Password too long', code: 400 }; 
    return { valid: true };
  }

}


export default AuthDTO;