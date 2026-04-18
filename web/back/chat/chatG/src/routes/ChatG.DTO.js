class ChatGDTO {
  static validateGetChatG(data) {
    const token = data.cookies.token;
    if (!token) {
      return { valid: false, message: 'Missing token', code : 400 };
    }
    return { valid: true };
  }

  static validatePostChatG(data) {
    const { message } = data;

    if (!message) {
      return { valid: false, message: 'Missing fields (post chat)', code : 400 };
    }
    if (message.lenght > 511)
      return { valid: false, message: 'Message too long', code : 413 };
    return { valid: true };
  }

}

export default ChatGDTO;