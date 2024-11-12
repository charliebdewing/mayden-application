// UI
export interface ListItem {
  name: string,
  price?: number,
  completed: boolean,
}

// I wanted to make these classes but vue 3 had so many issues with it
// https://stackoverflow.com/questions/68127272/vue-js-3-property-projects-does-not-exist-on-type-createcomponentpublicinst
export interface ShoppingList {
  id?: string,
  createdBy: string,
  created: Date,
  limit?: Number | null,
  items: ListItem[],
  access: {
    read: string[],
    write: string[]
  }
}

// Auth
export interface IUser {
  uid: string;
  email: string | null;
  name: string | null;
  image: string | null,
  lists?: DocumentReferences[]
}
