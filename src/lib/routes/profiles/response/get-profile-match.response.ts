export interface GetProfileMatchResponse {
  matches: ProfileMatch[]
}

export interface ProfileMatch {
  id: string;
  name: string;
  imageUrl: string;
}
