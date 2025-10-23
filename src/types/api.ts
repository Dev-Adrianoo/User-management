
// Resposta padrão da API ( SUCESSO )

export interface ApiSuccessResponse<T = any> {
  success: true
  message?: string
  data?: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  message?: string
  details?: any
}


// Resposta generica da api

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse


export interface CepData {
  cep: string
  cidade: string
  estado: string
}


// RESPOSTA DA API DE CEP

export interface CepResponse {
  success: boolean
  data?: CepData
  error?: string
}

// Parametros de paginação

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  order?: "asc" | "desc"
}

// resposta paginada

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// erro validação zod
export interface ValidationError {
  field: string
  message: string
}

// Resposta do erro de validação
export interface ValidationErrorResponse {
  success: false
  error: "Validation Error"
  errors: ValidationError[]
}