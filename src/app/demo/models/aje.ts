

export interface DemandeAje {
    id?: number;
    requesterId?: string;
    status?: string;
    businessDomain?: string;
    bankAccountReference?: string;
    contractReference?: string;
    contractPurpose?: string;
    contractingOrganizationName?: string;
    organizationAddress?: string;
    organizationPhone?: string;
}

export interface DemandeAjeResponse {
    content: DemandeAje[];
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
