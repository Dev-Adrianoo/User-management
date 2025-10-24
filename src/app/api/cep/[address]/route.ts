import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ address: string }> }) {
  const resolvedParams = await context.params;
  const { address: cep } = resolvedParams;

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (response.ok && !data.erro) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao buscar CEP' }, { status: 500 });
  }
}