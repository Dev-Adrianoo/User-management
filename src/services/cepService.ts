type ViaCepResponse = {
  cep: string,
  bairro: string,
  uf: string,
  erro?: boolean
}

export const getAdressByCep = async (cep: string) => {
  if(!cep || cep.length !== 8) {
    throw new Error('CEP inválido');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data: ViaCepResponse = await response.json();

    if (!response.ok || data.erro) {
      throw new Error('CEP não encontrado');
    }

    return data;

  } catch (error) {
    if (error instanceof Error) {
      throw error; 
    }
    throw new Error('Erro ao buscar CEP');
  }

}