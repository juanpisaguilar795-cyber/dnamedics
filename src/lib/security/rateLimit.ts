// Rate limiter en memoria (funciona en Edge/Node)
// Para producción con alta carga, migrar a Upstash Redis

const attempts = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  key: string;          // IP u otro identificador
  limit?: number;       // máximo de intentos
  windowMs?: number;    // ventana de tiempo en ms
}

export function rateLimit({ key, limit = 10, windowMs = 60_000 }: RateLimitOptions): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  attempts.forEach((val, key) => {
    if (now > val.resetAt) attempts.delete(key);
  });
}, 300_000);
