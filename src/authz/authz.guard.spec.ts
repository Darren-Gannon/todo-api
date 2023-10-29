import { AuthzGuard } from './authz.guard';

describe('AuthzGuard', () => {
  it('should be defined', () => {
    expect(new AuthzGuard({
      audience: '',
      issuerUrl: '',
    })).toBeDefined();
  });
});
