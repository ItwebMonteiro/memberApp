// Tipos TypeScript para as respostas da API

export interface User {
  id: number
  nome: string
  email: string
  role: string
  centroId?: number
  centroNome?: string
  activo: boolean
  dataCriacao: string
  ultimoLogin?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nome: string
  email: string
  password: string
  role: string
  centroId?: number
}

export interface Center {
  id: number
  nome: string
  descricao?: string
  endereco: string
  telefone?: string
  email?: string
  activo: boolean
  dataCriacao: string
  responsavel?: string
  valorMensalidade: number
  totalMembros: number
  membrosActivos: number
}

export interface CreateCenterRequest {
  nome: string
  descricao?: string
  endereco: string
  telefone?: string
  email?: string
  responsavel?: string
  valorMensalidade: number
}

export interface UpdateCenterRequest extends CreateCenterRequest {
  activo: boolean
}

export interface Member {
  id: number
  nome: string
  email: string
  telefone?: string
  endereco: string
  dataNascimento: string
  numeroIdentificacao?: string
  centroId: number
  centroNome: string
  activo: boolean
  dataRegisto: string
  dataUltimoPagamento?: string
  contactoEmergenciaNome?: string
  contactoEmergenciaTelefone?: string
  contactoEmergenciaRelacao?: string
  observacoes?: string
  registadoPorNome?: string
  totalPago: number
  totalDevido: number
  statusPagamento: string
}

export interface CreateMemberRequest {
  nome: string
  email: string
  telefone?: string
  endereco: string
  dataNascimento: string
  numeroIdentificacao?: string
  centroId: number
  contactoEmergenciaNome?: string
  contactoEmergenciaTelefone?: string
  contactoEmergenciaRelacao?: string
  observacoes?: string
}

export interface UpdateMemberRequest extends CreateMemberRequest {
  activo: boolean
}

export interface Payment {
  id: number
  membroId: number
  membroNome: string
  valor: number
  dataPagamento: string
  dataVencimento: string
  metodoPagamento: string
  status: string
  tipoPagamento: string
  observacoes?: string
  numeroTransacao?: string
  registadoPorNome?: string
  dataRegisto: string
  mesReferencia: number
  anoReferencia: number
}

export interface CreatePaymentRequest {
  membroId: number
  valor: number
  dataPagamento: string
  dataVencimento: string
  metodoPagamento: string
  status: string
  tipoPagamento: string
  observacoes?: string
  numeroTransacao?: string
  mesReferencia: number
  anoReferencia: number
}

export interface Notification {
  id: number
  titulo: string
  mensagem: string
  tipo: string
  status: string
  dataEnvio: string
  dataEntrega?: string
  destinatarios?: string
  membroId?: number
  centroId?: number
  enviadoPorNome?: string
  erroMensagem?: string
  tentativasEnvio: number
}

export interface CreateNotificationRequest {
  titulo: string
  mensagem: string
  tipo: string
  destinatarios?: string
  membroId?: number
  centroId?: number
}

export interface Report {
  id: number
  nome: string
  tipo: string
  descricao?: string
  parametros: string
  dataGeracao: string
  centroId?: number
  geradoPorNome: string
  formato: string
  caminhoArquivo?: string
  tamanhoArquivo?: number
  status: string
}

export interface CreateReportRequest {
  nome: string
  tipo: string
  descricao?: string
  parametros: any
  centroId?: number
  formato: string
}
