class Oauth2DTO {
  static validateGoogle(data) {
    const { access_token, frontendUrl } = data;

    if (!access_token || !frontendUrl) {
      return { valid: false, message: 'Missing fields (Google OAuth)', code : 400 };
    }
    return { valid: true };
  }

  static validateGit(req) {
    const back = req.query.backUrl;
    const frontendUrl = req.query.frontendUrl;
    console.log("validateGit", back, frontendUrl);
    if (!back || !frontendUrl) {
      return { valid: false, message: 'Missing fields (Git)', code : 400 };
    }
    return { valid: true };
  }

  static validateGitCallback(req) {
    const code = req.query.code;
    const frontendUrl = req.session.frontendUrl;
    if (!code || !frontendUrl) {
      return { valid: false, message: 'Missing fields (Git)', code : 400 };
    }
    return { valid: true };
  }

}

export default Oauth2DTO;