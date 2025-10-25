import { NextRequest, NextResponse } from "next/server"
import * as authService from "@/services/authService"
import { success } from "zod";


export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    const user = await authService.validateUserToken(authHeader)

    return NextResponse.json({
      success: true,
      user,
    },
      { status: 200 }
    )

  } catch (error) {

    if (error instanceof Error) {
      if (
        error.message === "Token não fornecido" ||
        error.message == "Token inválido ou expirado!"
      ) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 401 }
        )
      }
    }

    console.error("Error in /api/auth/me", error)
    return NextResponse.json({
      success: false,
      error: "Erro ao buscar dados do usuário",
    },
      { status: 500 }
    )
  }
}