import { NextRequest, NextResponse } from "next/server"
import { success, ZodError } from "zod"
import * as authService from "@/services/authService"


export async function POST(request: NextRequest) {

  try {
    const body = await request.json();

    const { user, token } = await authService.loginUser(body)

    return NextResponse.json({
      success: true,
      message: "Login Relizado com sucesso!",
      user: user,
      token: token,
    },
      { status: 200 }
    )
  } catch (error) {

    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation Error",
        errors: error.flatten().fieldErrors,
      },
        { status: 400}
      )
    }
    if (error instanceof Error && error.message == "Email ou senha inválidos") {
      return NextResponse.json({
        success: false,
        error: "Email senha inválidos",
      },
        { status: 401 }
      )
    }

    console.error("Erro ao fazer login", error)
    return NextResponse.json({
      success: false,
      error: "Error ao fazer login",
    },
      { status: 500 }
    )
  }
}
