import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AppConfig } from '../config/config';

const { appEnv, stackName } = new AppConfig();
export class ServiceAStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const lambdaName = `${stackName}-lambda-${appEnv}`;
    const serviceALambdaFunction = new NodejsFunction(this, `${lambdaName}`, {
      functionName: `${lambdaName}`,
      description: `A lambda function of stack ${stackName} in ${appEnv} env`,
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: path.join(__dirname, '../src/serviceA/handler.ts'),
      handler: 'handler',
      logRetention: RetentionDays.THREE_MONTHS,
    });
    new cdk.CfnOutput(this, `${lambdaName}-arn`, {
      value: serviceALambdaFunction.functionArn,
      description: `The ARN of the lambda function: ${lambdaName}`,
      exportName: `${lambdaName}-arn`,
    });
  }
}
