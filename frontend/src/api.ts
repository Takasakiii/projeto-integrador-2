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

export interface LoginResponseRaw {
  token: string;
  user: SecureUser;
}

export interface LoginResponse {
  restrictedApi: RestrictedApi;
  user: SecureUser;
}

export interface ItemRegister {
  name: string;
  description: string;
  amount: number;
}

export interface ItemResponse {
  id: string;
  name: string;
  description: string;
  amount: number;
  owner: string;
}

export interface ItemImageResponse {
  item: ItemResponse;
  images: string[];
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
      const { token, user } = (await response.json()) as LoginResponseRaw;
      return {
        restrictedApi: new RestrictedApi(this.baseUrl, token),
        user,
      };
    }

    if (response.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao realizar o login, tente novamente mais tarde.");
  }

  async getItems(page: number = 0): Promise<ItemResponse[]> {
    const response = await fetch(`${this.baseUrl}/items?page=${page}`);

    if (response.status === 200) {
      return response.json();
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao buscar itens");
  }
}

export class RestrictedApi {
  constructor(private baseUrl: string, private token: string) {}

  async addItem(
    itemData: ItemRegister,
    images: File[]
  ): Promise<ItemImageResponse> {
    const responseItemRegister = await fetch(`${this.baseUrl}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(itemData),
    });

    if (responseItemRegister.status !== 201) {
      console.error(
        responseItemRegister.status,
        await responseItemRegister.json()
      );
      throw new Error("Erro ao cadastrar item");
    }

    const item: ItemResponse = await responseItemRegister.json();

    let imagesResponse: { images: string[] } = { images: [] };
    if (images.length > 0) {
      const formData = new FormData();
      for (const image of images) {
        formData.append("image", image);
      }

      const responseImages = await fetch(
        `${this.baseUrl}/items/${item.id}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: formData,
        }
      );

      if (responseImages.status !== 201) {
        console.error(responseImages.status, await responseImages.json());
        throw new Error("Erro ao cadastrar imagens");
      }

      imagesResponse = await responseImages.json();
    }

    return {
      item,
      images: imagesResponse.images,
    };
  }
}

const doacaoApi = new DoacaoApi();

export default doacaoApi;
