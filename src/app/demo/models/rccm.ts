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
    company?: {
        name: string;
        ifu: string;
        address: string;
    };
    generatedDocument?: {
        label: string;
        path: string;
    };
    isPaid?: boolean;
    type?: string;
    rccm?: string;
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
