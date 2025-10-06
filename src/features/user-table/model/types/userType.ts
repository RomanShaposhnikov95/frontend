export interface UserType {
    id: number;
    owner: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface UsersResponseDto {
    page: number;
    totalPages: number;
    totalLogs: number;
    logs: UserType[];
}
