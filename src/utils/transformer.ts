export const transformUser = (user: any, profile: any) => {
  if (!profile) {
    return {
      uid: user.uid,
      firstName: '',
      lastName: '',
      email: user.email,
      phone: user.phoneNumber,
      bio: '',
      roles: ['Customer'],
      accessToken: user.stsTokenManager?.accessToken,
      refreshToken: user.stsTokenManager?.refreshToken,
      expirationTime: user.stsTokenManager?.expirationTime,
    }
  }

  return {
    uid: user.uid,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phoneNumber,
    bio: profile.bio,
    roles: profile.roles,
    accessToken: user.stsTokenManager?.accessToken,
    refreshToken: user.stsTokenManager?.refreshToken,
    expirationTime: user.stsTokenManager?.expirationTime,
  }
}
