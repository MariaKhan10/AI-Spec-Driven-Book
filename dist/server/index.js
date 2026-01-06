"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const personalizeAPI_1 = require("./personalizeAPI");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// CORS configuration to allow requests from Docusaurus app
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3000/AI-Spec-Driven-Book', // In case of base URL
        'http://localhost:5001', // Backend API for internal communication
        'http://localhost:3001' // Self-origin
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// API Routes
app.get('/api/personalize', personalizeAPI_1.PersonalizeAPI.getPersonalize);
app.post('/api/personalize', personalizeAPI_1.PersonalizeAPI.postPersonalize);
app.get('/api/personalization-settings', personalizeAPI_1.PersonalizeAPI.getPersonalizationSettings);
app.put('/api/personalization-settings', personalizeAPI_1.PersonalizeAPI.putPersonalizationSettings);
app.post('/api/personalize/batch', personalizeAPI_1.PersonalizeAPI.postBatchPersonalize);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map