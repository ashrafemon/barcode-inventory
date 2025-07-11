export type LoginDto = {
    email: string;
    password: string;
};

export type RegisterDto = {
    name: string;
    email: string;
    password: string;
};

export interface User {
    id: string;
    name: string;
    email: string;
}
