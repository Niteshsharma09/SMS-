
export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
}

export type Order = {
    id: string;
    userId: string;
    orderDate: string; // ISO 8601 format
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
}
