import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { generateToken } from "@/lib/jwt"
import { toPublicUser } from "@/lib/utils"
import { z } from "zod"

const backendSignupSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  cep: z.string().optional(),
  estado: z.string().optional(),
  cidade: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
     

    const validatedData = backendSignupSchema.parse(body)
    
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
        estado: validatedData.estado || null,
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
    console.error("ERRO NO BACKEND:", error)
    
    if (error instanceof z.ZodError) {
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
    
    return NextResponse.json({
      success: false,
      error: "Erro ao cadastrar usuário",
    },
      { status: 500 }
    )
  }
}