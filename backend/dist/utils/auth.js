"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const crypto_1 = __importDefault(require("crypto"));
const TOKEN_TTL_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS || 60 * 60 * 8);
function base64Url(input) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
function fromBase64Url(input) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf8");
}
function getSecret() {
    return process.env.JWT_SECRET || process.env.AUTH_SECRET || "change-this-secret-before-production";
}
function hashPassword(password) {
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    const hash = crypto_1.default.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
    return `pbkdf2$${salt}$${hash}`;
}
function verifyPassword(password, storedPassword) {
    if (!storedPassword) {
        return false;
    }
    if (!storedPassword.startsWith("pbkdf2$")) {
        if (Buffer.byteLength(password) !== Buffer.byteLength(storedPassword)) {
            return false;
        }
        return crypto_1.default.timingSafeEqual(Buffer.from(password), Buffer.from(storedPassword));
    }
    const [, salt, hash] = storedPassword.split("$");
    const candidate = crypto_1.default.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
    if (Buffer.byteLength(candidate) !== Buffer.byteLength(hash)) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}
function signToken(payload) {
    const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = base64Url(JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    }));
    const signature = crypto_1.default
        .createHmac("sha256", getSecret())
        .update(`${header}.${body}`)
        .digest();
    return `${header}.${body}.${base64Url(signature)}`;
}
function verifyToken(token) {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) {
        return null;
    }
    const expectedSignature = base64Url(crypto_1.default.createHmac("sha256", getSecret()).update(`${header}.${body}`).digest());
    if (!crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
    }
    const payload = JSON.parse(fromBase64Url(body));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
    }
    return payload;
}
//# sourceMappingURL=auth.js.map