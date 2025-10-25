import { NextRequest, NextResponse } from 'next/server';
import * as cepService from "@/services/cepService"

type Context = {
  params: {
    address: string;
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)

    const cep = url.pathname.split('/').pop()
    
    console.log("[ DEBUG ] quais dados vem para o cep?")

    if (!cep) {
      return NextResponse.json({ error: 'CEP não fornecido' }, { status: 400 });
    }

    const data = await cepService.getAdressByCep(cep);
    
    return NextResponse.json(data);

  } catch (error) {

    if (error instanceof Error) {
      if (error.message === 'CEP inválido') {
        return NextResponse.json({ error: error.message }, { status: 400 }); 
      }
      if (error.message === 'CEP não encontrado') {
        return NextResponse.json({ error: error.message }, { status: 404 }); 
      }
    }
    console.error('Erro ao buscar CEP:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao buscar CEP' }, { status: 500 });
  }
}