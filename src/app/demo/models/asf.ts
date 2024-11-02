

export interface DemandeAsf {
    id?: number;
    requesteType?: string;
    requesterId?: string;
    status?: string;
    rccmReference?: string,
    ifuNumber?: string,
    address?: string,
    phoneNumber?: string,
    businessDomain?: string;
    bankAccountReference?: string;
    contractReference?: string;
    contractPurpose?: string;
    contractingOrganizationName?: string;
    organizationAddress?: string;
    organizationPhone?: string;
}

export interface DemandeAsfResponse {
    content: DemandeAsf[];
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
