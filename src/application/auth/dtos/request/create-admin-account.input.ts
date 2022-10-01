export class CreateAdminAccountBody {
  email: string;
  password: string;
}

export class SendInvitationBody {
  email: string;
}

export class ValidateInvitation {
  id: string;
}
