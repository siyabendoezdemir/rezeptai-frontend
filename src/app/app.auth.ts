import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/ILV',
  requireHttps: false,
  redirectUri: environment.frontendBaseUrl,
  postLogoutRedirectUri: environment.frontendBaseUrl,
  clientId: 'rezeptai-client',
  scope: 'openid profile roles offline_access',
  responseType: 'code',
  showDebugInformation: true,
  requestAccessToken: true,
  silentRefreshRedirectUri: environment.frontendBaseUrl + '/silent-refresh.html',
  silentRefreshTimeout: 5000,
  clearHashAfterLogin: true,
  useSilentRefresh: true,
  timeoutFactor: 0.75,
  sessionChecksEnabled: true,
  sessionCheckIntervall: 30000,
  disablePKCE: false,
  useIdTokenHintForSilentRefresh: true,
  skipIssuerCheck: true,
  strictDiscoveryDocumentValidation: false
};