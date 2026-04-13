class ChatPDTO {
    static validatePostChatP(req){
        console.log
        console.log("in DTO")
        if (!req.cookies.token)
            return {valid: false, message: 'Unauthorized', code: 401};
        console.log("1")
        if (!req.body.id || !req.body.message)
            return {valid: false, message: 'Missing name or message', code: 400};
        console.log("2")
        if (typeof req.body.id !== 'string' || typeof req.body.message !== 'string')
            return {valid: false, message: 'Name and message must be strings', code: 400};
        return {valid: true};
    }

    static validateGetChatP(req){
        if (!req.cookies.token)
            return {valid: false, message: 'Unauthorized', code: 401};
        if (!req.params.name)
            return {valid: false, message: 'Missing name', code: 400};
        if (typeof req.params.name !== 'string')
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