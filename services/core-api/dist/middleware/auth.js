"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_js_1 = require("../lib/supabase.js");
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    try {
        // Use the shared service role client to verify the user token
        const { data: { user }, error } = await supabase_js_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Token verification failed' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map