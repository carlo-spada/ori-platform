"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import the routers
const applications_js_1 = require("./routes/applications.js");
const dashboard_js_1 = require("./routes/dashboard.js");
const experiences_js_1 = require("./routes/experiences.js");
const education_js_1 = require("./routes/education.js");
const jobs_js_1 = require("./routes/jobs.js");
const payments_js_1 = require("./routes/payments.js");
const setupIntent_js_1 = __importDefault(require("./routes/setupIntent.js"));
const subscriptions_js_1 = __importDefault(require("./routes/subscriptions.js"));
const users_js_1 = __importDefault(require("./routes/users.js"));
const chat_js_1 = __importDefault(require("./routes/chat.js"));
const profile_js_1 = __importDefault(require("./routes/profile.js"));
const notifications_js_1 = require("./routes/notifications.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
// Health check route
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});
// Stripe webhook route needs to be before express.json()
app.use('/api/v1/payments/webhook', express_1.default.raw({ type: 'application/json' }), payments_js_1.paymentWebhookRoutes);
app.use(express_1.default.json());
// Mount API routers
app.use('/api/v1/applications', applications_js_1.applicationRoutes);
app.use('/api/v1/dashboard', dashboard_js_1.dashboardRoutes);
app.use('/api/v1/experiences', experiences_js_1.experiencesRoutes);
app.use('/api/v1/education', education_js_1.educationRoutes);
app.use('/api/v1/chat', chat_js_1.default);
app.use('/api/v1/jobs', jobs_js_1.jobRoutes);
app.use('/api/v1/payments', payments_js_1.paymentRoutes);
app.use('/api/v1/setup-intent', setupIntent_js_1.default);
app.use('/api/v1/subscriptions', subscriptions_js_1.default);
app.use('/api/v1/profile', profile_js_1.default);
app.use('/api/v1/users', users_js_1.default);
app.use('/api/v1/notifications', notifications_js_1.notificationsRouter);
app.listen(port, () => {
    console.log(`[core-api]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map