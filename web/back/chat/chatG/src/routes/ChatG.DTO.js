class ChatGDTO {
  static validateGetChatG(data) {
    const token = data.token;
    if (!token) {
      return { valid: false, message: 'Missing token', code : 400 };
    }
    return { valid: true };
  }

  static validatePostChatG(data) {
    const { message, time } = data;

    if (!message || !time) {
      return { valid: false, message: 'Missing fields (post chat)', code : 400 };
    }
    return { valid: true };
  }

}

export default ChatGDTO;