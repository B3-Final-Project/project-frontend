export interface RegisterResponse {
  "UserConfirmed": boolean,
  "CodeDeliveryDetails": CodeDeliveryDetails,
  "UserSub": string,
}

export interface CodeDeliveryDetails {
  "Destination": string,
  "DeliveryMedium": string,
  "AttributeName": string
}
