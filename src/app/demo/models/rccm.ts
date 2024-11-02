export interface File {
    label: string;
    path: string;
}

export interface DemandeRccm {
    id?: number;
    requesterId?: string;
    status?: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt?: string;
    files?: File[];
}

export interface DemandeRccmResponse {
    content: DemandeRccm[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    last: boolean;
    first: boolean;
}
