

import { express} from '../index_p.js';

const router = express.Router();

import AuthDTO from './auth.DTO.js';
import { errorHandler} from '../index_p.js';

import AuthService from './auth.service.js';

router.post('/session', async (req, res) => {
  console.log("je suis dans la nouvelle route login")
  const validation = AuthDTO.validateLogin(req.body);
  if (!validation.valid) {
    return errorHandler(validation.message, validation.code || 400, res);
  }

  const { email, password, host } = req.body;

  try {
    console.log("Api /login called");
    const result = await AuthService.login({ email, password, host, res });
    if (!result.success) {
      return errorHandler(result.message, result.code || 400, res);
    }
    res.status(200).json({ success: true, message: result.message, token: result.token, username: result.username, MPFA: result.MPFA });
  } catch (err) {
    res.status(500).json({ success: false, message: 'MySQL error' + err });
  }
});


router.post('/user', async (req, res) => {
    console.log("Api /register called");
    const validation = AuthDTO.validateRegister(req.body);
    if (!validation.valid) {
      return errorHandler(validation.message, validation.code || 400, res);
    }

    const { name, password, email } = req.body;
    try {
    const result = await AuthService.register({ name, password, email });
    if (!result.success) {
      return errorHandler(result.message, result.code || 500, res);
    }
    res.status(201).json({ success: true, message: result.message, user_id: result.user_id });
    } catch (err) {
        res.status(500).json({success: false, message: 'MySQL error' + err });
    }
});

router.delete('/session', async (req, res) => {
  try {
    console.log("Api /logout called");
    if (!req.cookies.token) {
      return errorHandler("No token found", 400, res);
    }
    const result = await AuthService.logout(req.cookies.token);
    if (!result.success) {
      return errorHandler(result.message, result.code || 500, res);
    }
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: "You have been logged out" });
  }
    catch (err) {
      console.error("Logout error:", err);
        res.status(500).json({ success: false, message: 'MySQL error' + err });
    }
});

export default router;