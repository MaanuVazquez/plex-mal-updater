"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var webhookHandler_1 = __importDefault(require("./webhookHandler"));
var app = express_1.default();
var upload = multer_1.default({
    dest: '/tmp/'
});
var PORT = 3000 || process.env.PORT;
app.get('/', function (_, res) {
    res.send('Hello World!');
});
app.post('/', upload.single('thumb'), function (req, res) {
    webhookHandler_1.default(JSON.parse(req.body.payload));
    res.status(200);
});
app.listen(PORT, function () {
    console.log("Hey! we're running on port", PORT);
});
