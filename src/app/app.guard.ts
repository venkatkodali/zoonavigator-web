/*
 * Copyright (C) 2018  Ľuboš Kozmon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {ConfigService} from "./config";
import {ZSessionHandler, ZSessionService} from "./core";
import {AuthInfo, ConnectionParams} from "./core/zsession";
import {CONNECT_QUERY_ERROR_MSG, CONNECT_QUERY_RETURN_URL} from "./connect/connect-routing.constants";

/**
 * Looks for auto-connect configuration which this guard uses
 * to connect to Zookeeper and then redirects user to editor.
 *
 * Otherwise it redirects user to connect form.
 */
@Injectable()
export class AppGuard implements CanActivate {

  constructor(
    private router: Router,
    private configService: ConfigService,
    private zSessionService: ZSessionService,
    private zSessionHandler: ZSessionHandler
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.configService.config.autoConnectConnectionString) {
      let authInfo: AuthInfo[] = [];

      if (this.configService.config.autoConnectAuthInfo) {
        authInfo = this.configService.config.autoConnectAuthInfo.map<AuthInfo>(id => {
          return {
            id: id,
            scheme: "digest"
          };
        })
      }

      const connectionParams: ConnectionParams = {
        connectionString: this.configService.config.autoConnectConnectionString,
        authInfo: authInfo
      };

      this.zSessionService
        .create(connectionParams)
        .switchMap(sessionInfo => this.zSessionHandler.setSessionInfo(sessionInfo))
        .subscribe(
          () => {
            if (route.queryParamMap.has(CONNECT_QUERY_RETURN_URL)) {
              this.router.navigateByUrl(route.queryParamMap.get(CONNECT_QUERY_RETURN_URL));

              return;
            }

            this.navigateToEditor();
          },
          error => this.navigateToConnect(route, error)
        );
    } else {
      this.navigateToConnect(route);
    }

    return Observable.of(false);
  }

  private navigateToEditor(): void {
    this.router.navigate(["/editor"]);
  }

  private navigateToConnect(
    route: ActivatedRouteSnapshot,
    error?: string
  ): void {
    const queryParams = {};

    if (error) {
      queryParams[CONNECT_QUERY_ERROR_MSG] = error;
    }

    if (route.queryParamMap.has(CONNECT_QUERY_RETURN_URL)) {
      queryParams[CONNECT_QUERY_RETURN_URL] = route.queryParamMap.get(CONNECT_QUERY_RETURN_URL);
    }

    this.router.navigate(["/connect"], {
      queryParams: queryParams
    });
  }
}
