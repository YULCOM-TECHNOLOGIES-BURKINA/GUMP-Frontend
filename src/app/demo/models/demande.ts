export interface Demande {
    id?: number;
    acte?: string;
    date?: string;
    status?: string;
    company?: {
      name: string;
      address: string;
      location: string;
      bp: string;
      phone: string;
    };
    anpeNumber?: string;
    cnssNumber?: string;
    rejectionReason?: string;
  }
  