import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse, userAgent } from "next/server"
import { hash } from "bcryptjs"
import { signupSchema } from "@/services/validations/auth"
import { generateToken } from "@/services/jwt"
import { toPublicUser } from "@/services/utils"
import { ZodError } from "zod"


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = signupSchema.parse(body)
    const existingUser = await prisma.user.findUnique({ where: { email: validatedData.email } })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email já cadastrado",
        },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        nome: validatedData.name,
        email: validatedData.email,
        senhaHash: hashedPassword,
        role: "USER",
        cep: validatedData.cep || null,
        estado: validatedData.cidade || null,
        cidade: validatedData.cidade || null,
      },
    })

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const publicUser = toPublicUser(user)

    return NextResponse.json({
      success: true,
      message: "Usuário cadastrado com sucesso",
      user: publicUser,
      token,
    },
      { status: 201 }
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
    console.error("Erro in register: ", error)
    return NextResponse.json({
      success: false,
      error: "Erro ao cadastrar usuário",
    },
      { status: 500 }
    )
  }
}  
