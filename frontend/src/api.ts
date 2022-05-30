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
}

const doacaoApi = new DoacaoApi();

export default doacaoApi;
