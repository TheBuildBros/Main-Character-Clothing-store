export interface User {
  username: string;
  email: string;
  phone: string;
  tier?: string;
  joinedDate?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  houseNumber: string;
  streetName: string;
  areaLocality: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface CollectionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  season: string;
  itemCount: number;
  featuredImage: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}
