
export class AuthzManagementModuleConfig {
    constructor(
        public readonly domain: string,
        public readonly clientId: string,
        public readonly clientSecret: string,
        public readonly resourceId: string,
    ) { }
}
