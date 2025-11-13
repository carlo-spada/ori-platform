"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
// GET /api/v1/users/me
// Fetches the profile for the currently authenticated user.
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { data: profile, error } = await supabase_1.supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', req.user.id)
            .single();
        if (error) {
            // This could happen if the profile trigger failed, or for other reasons.
            console.error('Error fetching user profile:', error);
            return res.status(404).json({ error: 'User profile not found.' });
        }
        return res.status(200).json(profile);
    }
    catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map