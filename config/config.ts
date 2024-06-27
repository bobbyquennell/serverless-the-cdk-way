import * as Yup from 'yup';
import * as dotenv from 'dotenv';
import * as path from 'path';
const ConfigSchema = Yup.object<NodeJS.ProcessEnv>()
  .noUnknown(false)
  .shape({
    APP_ENV: Yup.string()
      .oneOf(['test', 'staging', 'production'])
      .required()
      .default('test'),
    PORTFOLIO: Yup.string().required(),
    CDK_DEPLOY_ACCOUNT: Yup.string().required(),
    CDK_DEPLOY_REGION: Yup.string().required(),
  });
export type AppConfigType = ReturnType<typeof ConfigSchema.cast>;

export class AppConfig {
  private config: AppConfigType;
  public constructor() {
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

    if (!ConfigSchema.validateSync(process.env)) {
      throw new Error('App Config is invalid');
    }

    this.config = ConfigSchema.cast(process.env);
  }

  public get appConfig() {
    if (!this.config) {
      throw new Error('App Config is invalid at runtime');
    }
    return this.config;
  }

  public get appEnv() {
    return this.appConfig.APP_ENV;
  }
  public get portfolio() {
    return this.appConfig.PORTFOLIO;
  }
  public get deployConfig() {
    return {
      account: this.appConfig.CDK_DEPLOY_ACCOUNT,
      region: this.appConfig.CDK_DEPLOY_REGION,
    };
  }
}
