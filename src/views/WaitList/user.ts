export default interface User {
  id: string;
  email: string;
  name: string;
  address?: {
    country?: string,
    state?: string,
    city?: string,
    street?: string
  };
  phone?: string;
  avatarUrl?: string;
  createdAt?: number;
}