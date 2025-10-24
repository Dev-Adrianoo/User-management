import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { loginSchema } from "@/services/validations/auth"
import { generateToken } from "@/services/jwt"
import { toPublicUser } from "@/lib/utils"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma";



export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const validatedData = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Email ou senha inválidos",
        },
        { status: 401 }
      )
    }

    const isPasswordValid = await compare(validatedData.password, user.senhaHash)

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: "Email ou senha inválidos."
      },
        { status: 401 }
      )
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const publicUser = toPublicUser(user)

    return NextResponse.json({
      success: true,
      message: "Login relizado com sucesso",
      user: publicUser,
      token,
    },

      { status: 200 }
    )

  } catch (error) {

    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation Error",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
        { status: 400 }
      )
    }
    console.error("Error ao fazer login", error)

    return NextResponse.json({
      success: false,
      error: "Erro ao fazer login",
    },
      { status: 500 }
    )
  }
}