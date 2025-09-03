export interface Item {
  id: number;
  name: string;
  created_at: string;
}

const API_URL = "http://localhost:5000/api";

export const api = {
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    return response.json();
  },

  async createItem(name: string): Promise<Item> {
    const response = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Failed to create item");
    }
    return response.json();
  },
};
