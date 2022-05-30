export interface UserRegister {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface SecureUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: SecureUser;
}

class DoacaoApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASEURL ?? "http://localhost:4000";
  }

  async registerUser(user: UserRegister): Promise<SecureUser> {
    if (user.phone !== undefined) {
      user.phone = user.phone.replaceAll(/\D/g, "");

      if (user.phone.length === 0) {
        user.phone = undefined;
      }
    }

    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status === 201) {
      return response.json();
    }

    if (response.status === 409) {
      throw new Error("Email já cadastrado");
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao registrar usuário");
  }

  async login(login: Login): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    if (response.status === 200) {
      return response.json();
    }

    if (response.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao realizar o login, tente novamente mais tarde.");
  }
}

const doacaoApi = new DoacaoApi();

export default doacaoApi;
