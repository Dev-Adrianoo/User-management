import { SignJWT, jwtVerify } from "jose"
import { JWTPayload } from "@/types/auth"


const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
)


const JWT_EXPIRATION = "7d"


export async function generateToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
    try {
      const token = await new SignJWT({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      })
        .setProtectedHeader({ alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(JWT_SECRET)

        return token
    } catch (error) {
      console.error("Error generating JWT: ", error)
      throw new Error("Failed to generate token")
    }
}


export async function verifyToken(token: string): Promise<JWTPayload | null> {

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as any,
      iat: payload.iat,
      exp: payload.exp
    }

  } catch (error) {
    console.error("Error verifying JWT: ", error)
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null{
  
  if(!authHeader) return null;

  const parts = authHeader.split(" ")
  if(parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1]
}

export function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000)
  return exp < now
}