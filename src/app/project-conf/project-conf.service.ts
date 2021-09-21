import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionConfig } from './session-config.interface';
import { SessionReference } from './session-reference.interface';
import serverConfig from '../../server/server-config.json';
import { BehaviorSubject } from 'rxjs';
import { NewUser } from './new-user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectConfService {
  private baseUrl = `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.port}`;
  private conf?: SessionConfig;
  private currentUser?: string;
  private configs?: SessionReference[];

  configschange = new BehaviorSubject<SessionReference[]>([]);
  sessionInfoChanged = new BehaviorSubject<SessionConfig | null>(null);

  constructor(private http: HttpClient) {
    this.init();
  }

  async init() {
    await this.loadConfig();
    if (this.configs) {
      this.configschange.next(this.configs);
    }
  }

  async getNewUser(): Promise<NewUser> {
    return this.http
      .get<NewUser>('http://localhost:3000/participant/new')
      .toPromise();
  }

  async createUser(user: NewUser): Promise<SessionConfig> {
    const config = await this.http
      .post<SessionConfig>(
        `http://localhost:3000/participant/${user.id}/config`,
        user
      )
      .toPromise();
    await this.loadConfig();

    if (this.configs) {
      this.configschange.next(this.configs);
    }

    return config;
  }

  private async loadConfig() {
    try {
      this.configs = await this.http
        .get<SessionReference[]>(`${this.baseUrl}/configs`)
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async selectUser(userId: string) {
    if (userId !== this.currentUser) {
      this.conf = undefined;
      this.currentUser = userId;
      this.getUserConf();
    }
  }

  private getUserConf() {
    if (!this.currentUser) {
      throw 'Unknown user. Set user ID by running `selectUser(<userId: string>)` first.';
    } else if (!this.conf) {
      const suffix = this.currentUser.split(':').pop();
      this.http
        .get<SessionConfig>(`http://localhost:3000/${suffix}/config.json`)
        .subscribe((config) => this.sessionInfoChanged.next(config));
    }
  }
}
