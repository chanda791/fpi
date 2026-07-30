import crypto from "crypto";

const TOKEN_TTL_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS || 60 * 60 * 8);

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function getSecret() {
  return process.env.JWT_SECRET || process.env.AUTH_SECRET || "change-this-secret-before-production";
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");

  return `pbkdf2$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!storedPassword) {
    return false;
  }

  if (!storedPassword.startsWith("pbkdf2$")) {
    if (Buffer.byteLength(password) !== Buffer.byteLength(storedPassword)) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(storedPassword));
  }

  const [, salt, hash] = storedPassword.split("$");
  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");

  if (Buffer.byteLength(candidate) !== Buffer.byteLength(hash)) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

export function signToken(payload: { id: number | string; email: string; role: string }) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    })
  );
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${header}.${body}`)
    .digest();

  return `${header}.${body}.${base64Url(signature)}`;
}

export function verifyToken(token: string) {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const expectedSignature = base64Url(
    crypto.createHmac("sha256", getSecret()).update(`${header}.${body}`).digest()
  );

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  const payload = JSON.parse(fromBase64Url(body)) as {
    id: number | string;
    email: string;
    role: string;
    exp: number;
  };

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
