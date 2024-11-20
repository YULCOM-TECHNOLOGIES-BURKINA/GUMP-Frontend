export interface File {
    label: string;
    path: string;
}

export interface Company {
    name: string;
    ifu: string;
    adress: string;
}

export interface DemandeDrtss {
    id?: number;
    requesterId?: string;
    status?: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt?: string;
    rejectionReason?: string;
    company?: Company;
    files?: File[];
}

export interface DemandeDrtssResponse {
    content: DemandeDrtss[];
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
