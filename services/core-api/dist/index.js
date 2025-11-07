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
const jobs_js_1 = require("./routes/jobs.js");
const payments_js_1 = require("./routes/payments.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
// Add the Stripe webhook route BEFORE the global express.json() middleware.
// This ensures the body is received as a raw buffer for this specific endpoint.
app.post('/api/v1/payments/webhook', express_1.default.raw({ type: 'application/json' }), (_req, res) => {
    // Assuming the paymentsRouter has a method to handle the verified webhook
    // For now, we just acknowledge receipt. A real implementation would go here.
    console.log('Stripe webhook received.');
    res.status(200).send({ received: true });
});
// This middleware will now apply to all other routes.
app.use(express_1.default.json());
// Health check route
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});
// Mount API routers
app.use('/api/v1/applications', applications_js_1.applicationRoutes);
app.use('/api/v1/jobs', jobs_js_1.jobRoutes);
app.use('/api/v1/payments', payments_js_1.paymentRoutes);
app.listen(port, () => {
    console.log(`[core-api]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map