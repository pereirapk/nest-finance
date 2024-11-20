export interface JwtPayload {
    sub: number;    // Referência ao ID do usuário (subject)
    email: string;  // O email do usuário
  }