import { NextRequest, NextResponse } from "next/server"
import { success, ZodError } from "zod"
import { Prisma } from "@prisma/client"
import * as authService from "@/services/authService"


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { user, token } = await authService.registerUser(body)

    return NextResponse.json({
      success: true,
      message: "Usuário cadastro sucesso",
      user,
      token
    },
      { status: 201 }
    )
  } catch (error) {

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "Email já cadastrado",
          },
          { status: 409 }
        )
      }
    }

    console.error("ERRO NO BACKEND:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao cadastrar usuário",
      },
      { status: 500 }
    )
  }
}