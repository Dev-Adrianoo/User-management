"use client"

import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { isAxiosError } from "axios"

interface CepData {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string 
}

export function useCep() {
  const [isLoading, setIsloading] = useState(false)

  const fetchCep = async (cep: string): Promise<CepData | null> => {
    const cleanCep = cep.replace(/\D/g, "")

    if(cleanCep.length !== 8) {
      toast.error("CEP inválido (formato: 00000-000)")
      return null
    }

    setIsloading(true)

    try {
      const { data } = await api.get(`/api/cep/${cleanCep}`)
      toast.success("CEP encontrado!")
      return data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const message = error.response.data?.error || "Erro ao buscar CEP"
        toast.error(message)
      } else {
        toast.error("Ocorreu um erro inesperado ao buscar o CEP.")
        console.error(error)
      }
      return null
    } finally {
      setIsloading(false)
    }
  }

  return {
    fetchCep,
    isLoading,
  }
}