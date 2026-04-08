class ChatPDTO {
  static validateGetAllChatP(data) {
    const token = data.token;
    if (!token) {
      return { valid: false, message: 'Missing token', code : 400 };
    }
    return { valid: true };
  }

  static validateGetChatP(req) {
    const token = req.cookies.token;
    const name = req.query.name;
    if (!name) {
      return { valid: false, message: 'Missing name query parameter', code : 400 };
    }
    if (!token) {
      return { valid: false, message: 'Missing token', code : 400 };
    }
    return { valid: true };
  }

  static validatePostChatP(data, cookies) {
    const { message, time, id } = data;
    const token = cookies.token;
    if (!token)
      return { valid: false, message: 'Missing token', code : 400 };
    if (!message || !time || !id) {
      return { valid: false, message: 'Missing fields (post chat)', code : 400 };
    }
    return { valid: true };
  }
}

export default ChatPDTO;