export interface MeResponse{
  accessToken: string;
  user: {
    email: string;
    surname: string;
    name: string;
    picture: string;
  },
}
