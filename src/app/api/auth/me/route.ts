import { prisma } from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/services/jwt"
import { toPublicUser } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Token não fornecido!",
      },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({
        success: false,
        message: "Token inválido ou expirado",
      },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Usuário não encontrado",
      },
        { status: 404 }
      )
    }
    const publicUser = toPublicUser(user)

    return NextResponse.json({
      success: true,
      user: publicUser,
    },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in /api/auth/me", error)

    return NextResponse.json({
      success: false,
      error: "Erro ao buscar dados do usuário",
    },
      { status: 500 },
    )
  }
}
