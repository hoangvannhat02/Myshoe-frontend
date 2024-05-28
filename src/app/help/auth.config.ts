export const authConfig = {
    providers: [
      {
        provider: 'google',
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        scope: 'profile email'
      },
      {
        provider: 'facebook',
        clientId: 'YOUR_FACEBOOK_CLIENT_ID',
        scope: 'public_profile email'
      }
    ]
};