export interface DemandeDrtss {
    requesterId?: string;
    status?: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt?: string;
    files?: {
        label: string;
        path: string;

    };
  }
  