export interface UserRequest extends Request {
  user?: SessionData;
}

export class SessionData {
  id: string;
  username?: string;
  roles: string[];
}

export interface TokenResponse {
  token: string;
}

export class AcccessTokenResponse {
  accessToken: string;
  refreshToken: string;
}
