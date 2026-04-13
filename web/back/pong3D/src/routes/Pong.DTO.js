class PongDTO {

    static validateGetStat(req) {
        const token = req.cookies.token;
        const name = req.query.name;
        if (!token && !name) {
            return ({ valid: false, message: 'Missing token or name query parameter', code : 400 });
        }
        return ({ valid: true, token: token, name: name });
    }

    static validateGetHistory(req) {
        const token = req.cookies.token;
        const page = parseInt(req.params.page);
        const name = req.query.name;
        const limit = parseInt(req.query.limit);
        if (!token) {
            return ({ valid: false, message: 'Missing token', code : 400 });
        }
        if (!page || isNaN(page) || page < 0) {
            return ({ valid: false, message: 'Invalid page parameter', code : 400 });
        }
        return ({ valid: true, token, page, name , limit});
    }
}

export default PongDTO;