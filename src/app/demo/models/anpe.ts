export interface File {
    label: string;
    path: string;
}

export interface DemandeAnpe {
    id?: number;
    requesterId?: string;
    status?: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt?: string;
    files?: File[];

    // Contract information
    contractReference?: string;
    contractPurpose?: string;
    contractingOrganizationName?: string;
    organizationAddress?: string;
    organizationPhone?: string;

    // Employer information
    employerIdentification?: string;
    province?: string;
    commune?: string;
    street?: string;
    activitySector?: string;

    // Establishment information
    establishmentName?: string;
    managerLastName?: string;
    managerFirstName?: string;
    openingDate?: Date;
    cnssNumber?: string;
    mainActivity?: string;
    secondaryActivity?: string;

    // Staff numbers
    permanentWorkers?: number;
    temporaryWorkers?: number;
    apprentices?: number;
    interns?: number;

    // Employment periods
    fullEmploymentStart?: Date;
    fullEmploymentEnd?: Date;
    lowEmploymentStart?: Date;
    lowEmploymentEnd?: Date;

    // Intentions
    currentYearRecruitment?: boolean;
    nextYearRecruitment?: boolean;
    staffReduction?: boolean;

    // Training needs
    trainingDomain?: string;
    trainingCount?: number;
    perfectionnementModules?: string;
    perfectionnementCount?: number;

    // ANPE expectations
    anpeExpectations?: string;
}

export interface DemandeAnpeResponse {
    content: DemandeAnpe[];
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
