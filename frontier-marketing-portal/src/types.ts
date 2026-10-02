export type Role =
  | "employee"
  | "marketing";

export type Workflow =
  | "standard"
  | "moody";

export type Status =
  | "Submitted"
  | "In Progress"
  | "Proof Sent"
  | "Waiting Approval"
  | "Ordered"
  | "Completed"
  | "Rejected"
  | "Accepted"
  | "On Order List";

export interface RequestType {
  slug: string;
  title: string;
  description: string;
  icon: string;
  workflow: Workflow;
  external?: boolean;
  url?: string;
}

export interface MarketingRequest {
  id: string;
  requestNumber: string;
  typeSlug: string;
  typeTitle: string;
  workflow: Workflow;

  requesterName: string;
  requesterEmail: string;
  branchDepartment: string;

  dueDate: string;
  submittedAt: string;

  status: Status;

  assignedTo: string;

  details: Record<string, string>;

  submitterNote: string;
  privateNote: string;
}
