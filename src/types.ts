export type VisitorStatus = 'checked-in' | 'checked-out';

export type FilterType = 'all' | 'checked-in' | 'checked-out';

export interface Visitor {
  id: number;
  name: string;
  company: string;
  contactPerson: string;
  reason: string;
  badge: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: VisitorStatus;
}

export interface VisitorFormData {
  name: string;
  company: string;
  contactPerson: string;
  reason: string;
  badge: string;
}
