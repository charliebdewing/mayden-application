// UI
export interface ListItem {
  name: string,
  price?: number,
  completed: boolean,
}

export interface ShoppingList {
  id?: string,
  createdBy: string,
  created: Date,
  limit?: Number | null,
  items: ListItem[]
}
