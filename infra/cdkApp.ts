#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServiceAStack } from './serviceAStack';
import { AppConfig } from '../config/config';
import { SharedInfraStack } from './sharedInfraStack';

const { appEnv, portfolio, deployConfig } = new AppConfig();
const defaultStackProps = {
  env: {
    account: deployConfig.account,
    region: deployConfig.region,
  },
  tags: {
    environment: appEnv,
    ownership: portfolio,
    portfolio,
  },
};
const cdkApp = new cdk.App();
new SharedInfraStack(cdkApp, `${portfolio}-shared-infra-${appEnv}`, {
  appEnv,
  busName: `${portfolio}-event-bus`,
  ...defaultStackProps,
  description: `a stack that defines shared infrastructure resources for ${portfolio}`,
});

new ServiceAStack(cdkApp, `${portfolio}-service-a-${appEnv}`, {
  ...defaultStackProps,
  description: `a stack that defines resources for ${portfolio} service A`,
});
