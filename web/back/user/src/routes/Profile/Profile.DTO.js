import {validator,isValidPhoneNumber} from '../index.js';

class ProfileDTO {
  static validateData_Cookie(data, req) {
    const name = data.login;
    const tel = data.tel;
    const email = data.email;
    if (!name || !email || !tel)
      return { success: false, message: "missing data" , code: 400 };
	  if (name.length > 32 || email.length > 128 || tel.length > 128)
      return { success: false, message: "data too long" , code: 400 };
    if (!/^[a-zA-Z0-9_]+$/.test(name))
      return {valid: false,message: 'Username can only contain letters, numbers and underscores',code: 400};
    if (!validator.isEmail(email))
      return { success: false, message: "invalid email" , code: 400 };
    if (!isValidPhoneNumber(tel))
      return { success: false, message: "invalid phone number" , code: 400 };
    const token = req.cookies.token;
    if (!token)
      return { success: false, message: "no token" };

    return { success: true, name, token };
  }

    static validateToken(req) {
        const token = req.cookies.token;
        if (!token)
            return { success: false, message: "no token" };

        return { success: true, token };
    }

    static validatePassword_Cookie(req) {
		  const password = req.body.Pass;
		  const token = req.cookies.token;
      if (!password)
        	  return { success: false, message: "no password", code: 400 };
		  if (password.length > 128)
			  return { success: false, message: "password too long", code: 400 };
      if (password.length < 4) {
        return { valid: false, message: 'Password too short (min: 4 caract)', code: 400 };
      }
      if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter', code: 400 };
      }
      if (!/[0-9]/.test(password))
        return { valid: false, message: 'Password must contain at least one number character', code: 400 };
		  if (!token)
			  return { success: false, message: "no token" };
		  return { success: true, token };
    }
}



export default ProfileDTO;