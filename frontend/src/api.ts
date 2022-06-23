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
  restrictedApi: RestrictedData;
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
  thumbnail?: string;
}

export interface ItemImageResponse {
  item: ItemResponse;
  images: string[];
}

export interface PublicUser {
  id: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
}

export interface ItemWithUser {
  item: ItemResponse;
  user: PublicUser;
}

export interface IPagination<T> {
  totalPages: number;
  currentPage: number;
  data: T[];
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
        restrictedApi: {
          baseUrl: this.baseUrl,
          token,
        },
        user,
      };
    }

    if (response.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao realizar o login, tente novamente mais tarde.");
  }

  async getItems(page: number = 0): Promise<IPagination<ItemWithUser>> {
    const response = await fetch(`${this.baseUrl}/items?page=${page}`);

    if (response.status === 200) {
      const item: ItemResponse[] = await response.json();
      const itemWithUserPromise = item.map(async (item) => {
        const user = await fetch(`${this.baseUrl}/users/${item.owner}`);

        if (user.status === 200) {
          return {
            item,
            user: (await user.json()) as PublicUser,
          };
        }

        throw new Error("Erro ao buscar usuário");
      });

      return {
        data: await Promise.all(itemWithUserPromise),
        totalPages: Number(response.headers.get("X-Total-Pages") ?? "0"),
        currentPage: page,
      };
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao buscar itens");
  }

  getItemThumbnailUrl(item: ItemResponse): string | null {
    if (!item.thumbnail) return null;
    return `${this.baseUrl}/items/${item.id}/images/${item.thumbnail}`;
  }

  getImageUrl(image: string, itemId: string): string {
    return `${this.baseUrl}/items/${itemId}/images/${image}`;
  }

  async getItemImages(id: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/items/${id}/images`);

    if (response.status === 200) {
      const payload = await response.json();
      return payload.images;
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao buscar imagens");
  }

  async getItem(id: string): Promise<ItemWithUser> {
    const response = await fetch(`${this.baseUrl}/items/${id}`);

    if (response.status === 200) {
      const item: ItemResponse = await response.json();

      const userResponse = await fetch(`${this.baseUrl}/users/${item.owner}`);
      if (!userResponse.ok) {
        console.error(userResponse.status, await userResponse.json());
        throw new Error("Erro ao obter o dono");
      }

      const userData: SecureUser = await userResponse.json();
      return {
        item,
        user: userData,
      };
    }

    console.error(response.status, await response.json());
    throw new Error("Erro ao buscar item");
  }
}

export interface RestrictedData {
  baseUrl: string;
  token: string;
}

export interface InterestMessage {
  item: string;
  message: string;
}

export interface InterestMessageResponse {
  id: string;
  item: string;
  userSend: string;
  userReceive: string;
  message: string;
  createdAt: string;
}

export class RestrictedApi {
  constructor(private restrictedData: RestrictedData) {}

  async addItem(
    itemData: ItemRegister,
    images: File[]
  ): Promise<ItemImageResponse> {
    const responseItemRegister = await fetch(
      `${this.restrictedData.baseUrl}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.restrictedData.token}`,
        },
        body: JSON.stringify(itemData),
      }
    );

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
        `${this.restrictedData.baseUrl}/items/${item.id}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.restrictedData.token}`,
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

  async sendItemInteraction(
    message: InterestMessage
  ): Promise<InterestMessageResponse> {
    const response = await fetch(`${this.restrictedData.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.restrictedData.token}`,
      },
      body: JSON.stringify(message),
    });

    if (response.status !== 201) {
      console.error(response.status, await response.json());
      throw new Error("Erro ao cadastrar imagens");
    }

    return await response.json();
  }

  async getRestrictedUser(id: string): Promise<SecureUser> {
    const response = await fetch(`${this.restrictedData.baseUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.restrictedData.token}`,
      },
    });

    return await response.json();
  }
}

const doacaoApi = new DoacaoApi();

export default doacaoApi;
