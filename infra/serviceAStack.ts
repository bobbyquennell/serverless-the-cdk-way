import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AppConfig } from '../config/config';

const { appEnv } = new AppConfig();
export class ServiceAStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const worker = new NodejsFunction(this, `service-a-worker-${appEnv}`, {
      functionName: `service-a-worker-${appEnv}`,
      description: 'a lambda worker of example service A',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: path.join(__dirname, '../src/serviceA/handler.ts'),
      handler: 'handler',
      logRetention: RetentionDays.THREE_MONTHS,
    });
    new cdk.CfnOutput(this, 'worker', {
      value: worker.functionArn,
      description: `the arn of the lambda function: service-a-worker-${appEnv}`,
      exportName: `service-a-worker-${appEnv}`,
    });
  }
}
