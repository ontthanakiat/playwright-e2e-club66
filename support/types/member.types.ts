export interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  currentPlan: string; // API path like "/api/memberships/112571"
  planType: string;
  planTypeLabel: string;
  planTypeCategory: string;
  credit: string;
  creditsUsed: string;
  availableCredits: number;
  accumulatedCredits: number;
  lrcAccessible: boolean;
  keyExpire: string;
  ipAddress: string;
  [key: string]: any;
}

export interface MemberResponse {
  member: Member[];
  [key: string]: any;
}