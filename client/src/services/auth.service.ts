import { Injectable } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';

@Injectable()
export class AuthService {

  public currentUser: any;
  public accessToken: string;

  constructor(private fb: FacebookService) {
    const initParams: InitParams = {
      appId: '1355813487836449',
      xfbml: true,
      version: 'v2.8',
    };

    fb.init(initParams);
  }

  async login(): Promise<any> {
    const loginResponse = await this.fb.login();

    if (loginResponse.status === 'connected') {
      this.accessToken = loginResponse.authResponse.userID;
      return this.currentUser = await this.fb.api('/me');
    } else {
      throw new Error('Not connected');
    }
  }

}
