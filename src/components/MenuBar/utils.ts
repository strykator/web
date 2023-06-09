export const buildUserPayload = (user: any) => {
  return {
    uid: user.uid,
    firstName: '',
    lastName: '',
    email: user.email,
    mobile: user.phoneNumber,
    roles: ['Customer'],
    accessToken: user.stsTokenManager?.accessToken,
    refreshToken: user.stsTokenManager?.refreshToken,
    expirationTime: user.stsTokenManager?.expirationTime,
  }
}
