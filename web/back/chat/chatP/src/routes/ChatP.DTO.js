class ChatPDTO {
    static validatePostChatP(body, cookies){
        if (!cookies.token)
            return {valid: false, message: 'Unauthorized', code: 401};
        if (!body.name || !body.message)
            return {valid: false, message: 'Missing name or message', code: 400};
        if (typeof body.name !== 'string' || typeof body.message !== 'string')
            return {valid: false, message: 'Name and message must be strings', code: 400};
        return {valid: true};
    }

    static validateGetChatP(req){
        if (!req.cookies.token)
            return {valid: false, message: 'Unauthorized', code: 401};
        if (!req.query.name)
            return {valid: false, message: 'Missing name', code: 400};
        if (typeof req.query.name !== 'string')
            return {valid: false, message: 'Name must be a string', code: 400};
        return {valid: true};
    }

    static validateGetAllChatP(cookies){
        if (!cookies.token)
            return {valid: false, message: 'Unauthorized', code: 401};
        return {valid: true};
    }
}

export default ChatPDTO;