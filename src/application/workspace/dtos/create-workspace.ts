export class CreateWorkspaceBody {
  urlPath: string;
}

export class WorkspaceAndUsersCount {
  count: number;
  workspace: string;
}

export class GetOfficesByWorkspace {
  workspaceId: string;
}

export class GetOFloorsByOffice {
  officeId: string;
}
