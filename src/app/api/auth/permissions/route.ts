import { NextRequest, NextResponse } from "next/server";
import { extractTokenFromHeader, verifyToken } from "@/services/jwt";
import { getPermissionsForRole } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.role) {
      return NextResponse.json(
        { success: false, error: "Token inválido ou função não encontrada" },
        { status: 401 }
      );
    }

    const permissions = getPermissionsForRole(payload.role);

    return NextResponse.json(
      { success: true, data: permissions },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro na API de permissões:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
