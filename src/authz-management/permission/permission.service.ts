import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, combineLatest, of, map, switchMap, tap } from 'rxjs';
import { AuthzManagementModuleConfig } from '../authz-management.module-config';
import { Permission } from './permission';

@Injectable()
export class PermissionService {
    
    constructor(
        private readonly config: AuthzManagementModuleConfig,
        private readonly http: HttpService,
    ) { }

    private getAccessToken$() {
        return this.http.post(`https://${ this.config.domain }/oauth/token`, {
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            audience: `https://${ this.config.domain }/api/v2/`,
            grant_type: "client_credentials",
        })
    }

    public createPermissions(permissions:  Permission[]): Observable<Permission[]> {
        const accessToken$ = this.getAccessToken$().pipe(
            map(resp => resp.data.access_token),
        ); 

        const req$ = accessToken$.pipe(
            switchMap(token => combineLatest([
                of(token),
                this.http.get(`https://${ this.config.domain }/api/v2/resource-servers/${ this.config.resourceId }`, {
                    headers: {
                        Authorization: `Bearer ${ token }`,
                    }
                }).pipe(
                    map(resp => resp.data.scopes),
                ),
            ])),
            switchMap(([token, existingScopes]) => this.http.patch(`https://${ this.config.domain }/api/v2/resource-servers/${ this.config.resourceId }`, {
                scopes: [...permissions, ...existingScopes],
            }, {
                headers: {
                    Authorization: `Bearer ${ token }`,
                }
            })),
            map(resp => resp.data.scopes),
        );

        return req$;
    }

}
