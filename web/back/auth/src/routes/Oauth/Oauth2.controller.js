import {express, errorHandler} from '../index_p.js';

const router = express.Router();


import Oauth2DTO from './Oauth2.DTO.js';
import Oauth2Service from   './Oauth2.service.js';

router.get('/github', async (req, res) => {
    const valid = Oauth2DTO.validateGit(req);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code || 400, res);
    }
    const back = req.query.backUrl;
    const front = req.query.frontendUrl;
    const url = await Oauth2Service.github(back, front, req);
    if (!url.success) {
        return errorHandler(url.message, url.code, res);
    }
    res.redirect(url.url);
});


router.post('/github/callback', async (req, res) => {
    const valid = Oauth2DTO.validateGitCallback(req);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code || 400, res);
    }
    const code = req.query.code;
    const frontendUrl = req.session.frontendUrl;
    const result = await Oauth2Service.githubCallback(code, frontendUrl, res);
    if (!result.success) {
        return errorHandler(result.message, result.code, res);
    }
    res.redirect(result.frontendUrl);
});



router.post('/google', async (req, res) => {
    console.log("dans google")
    const valid = Oauth2DTO.validateGoogle(req.body);
    if (!valid.valid) {
        return errorHandler(valid.message, valid.code || 400, res);
    }
    console.log("validation google ok")
    const { access_token, frontendUrl } = req.body;
    try{
        const result = await Oauth2Service.google(access_token, frontendUrl, res);
        if (!result.success) {
            return errorHandler(result.message, result.code, res);
        }
        return res.status(200).json({success: true, message: 'Google authntication successful', MPFA: result.MPFA });
    } catch (err) {
        return res.status(500).json({ success: false, message: "error back google " + err });
    }
});


export default router;