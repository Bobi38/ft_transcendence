class FriendDTO {
  static validateName_Cookies(name, req) {
    if (!name)
      return { success: false, message: "no name" };
    
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

    static validateResponse(body, token) {
		const response = body.response;
		const login = body.login;
		if (response === undefined)
			return { success: false, message: "no response" };
		if (login === undefined)
			return { success: false, message: "no login" };
		if (!token)
			return { success: false, message: "no token" };
		return { success: true, token };
    }
}



export default FriendDTO;