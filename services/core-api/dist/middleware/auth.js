"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    try {
        // Use anon key for user operations
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        });
        const { data: { user }, error } = await supabase.auth.getUser();
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