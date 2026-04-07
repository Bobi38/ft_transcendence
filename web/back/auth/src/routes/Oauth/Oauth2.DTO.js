class Oauth2DTO {
  static validateGoogle(data) {
    const { access_token, frontendUrl } = data;

    if (!access_token || !frontendUrl) {
      return { valid: false, message: 'Missing fields (Google OAuth)', code : 400 };
    }
    return { valid: true };
  }

  static validateGit(data) {
    const back = data.query.backUrl;
    const frontendUrl = data.session.frontendUrl;
    if (!back || !frontendUrl) {
      return { valid: false, message: 'Missing fields (Git)', code : 400 };
    }
    return { valid: true };
  }

  static validateGitCallback(data) {
    const back = data.backUrl;
    const frontendUrl = data.frontendUrl;
    if (!back || !frontendUrl) {
      return { valid: false, message: 'Missing fields (Git)', code : 400 };
    }
    return { valid: true };
  }

}

export default Oauth2DTO;