export interface File {
    label: string;
    path: string;
}

export interface DemandeCnss {
    id?: number;
    requesterId?: string;
    status?: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt?: string;
    files?: File[];
}

export interface DemandeCnssResponse {
    content: DemandeCnss[];
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
