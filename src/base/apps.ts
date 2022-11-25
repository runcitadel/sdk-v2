import { ApiConnection } from "../common/connection.ts";
import { joinUrl } from "../common/utils.ts";
import type { app } from "../common/types.ts";

export class ManagerApps extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, "v2/apps"));
  }

  /**
   * List all apps
   *
   * @param installed Set this to true if you only want a list of installed apps
   * @returns A list of apps with metadata
   */
  async list(installed = false): Promise<{ apps: app[]; jwt: string }> {
    let { apps, jwt } = await this.get<{ apps: app[]; jwt: string }>(
      installed ? "/?installed=1" : "/",
    );

    apps = apps.map((app) => ({
      ...app,
      compatible: app.compatible ?? true,
    }));

    return { apps, jwt };
  }

  /**
   * Install an app
   *
   * @param id The id of the app
   */
  async install(id: string): Promise<void> {
    await this.post(`/${id}/install`);
  }

  /**
   * Uninstall an app
   *
   * @param id The id of the app
   */
  async uninstall(id: string): Promise<void> {
    await this.post(`/${id}/uninstall`);
  }

  /**
   * Update an app
   *
   * @param id The id of the app
   */
  async update(id: string): Promise<void> {
    await this.post(`/${id}/update`);
  }

  /**
   * Update all apps
   */
  async updateAll(): Promise<void> {
    await this.post(`/update`);
  }

  /**
   * Get a list of all apps which can be updates
   */
  async listUpdatable(): Promise<
    Record<
      string,
      {
        updateFrom: string;
        updateTo: string;
      }
    >
  > {
    return await this.get<
      Record<
        string,
        {
          updateFrom: string;
          updateTo: string;
        }
      >
    >(`/updates`);
  }

  async addStore(repo: string, branch: string): Promise<void> {
    await this.post("/sources", {
      repo,
      branch,
    });
  }

  getStores() {
    return this.get<{
      id: string;
      name: string;
      tagline: string;
      icon: string;
      developers: string;
      license: string;
      apps: Record<string, string>;
      commit: string;
      repo: string;
      branch: string;
      subdir: string;
    }>("/stores");
  }
}
