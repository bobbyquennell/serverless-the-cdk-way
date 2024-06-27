import * as cdk from 'aws-cdk-lib';
import { EventBus, Match, Rule } from 'aws-cdk-lib/aws-events';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { StackProps } from 'aws-cdk-lib';

export interface SharedInfraStackProps extends StackProps {
  appEnv: 'test' | 'staging' | 'production';
  busName: string;
}
export class SharedInfraStack extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    { appEnv, busName, ...restProps }: SharedInfraStackProps,
  ) {
    super(scope, id, restProps);

    const eventBus = new EventBus(this, `${busName}-${appEnv}`, {
      eventBusName: `${busName}-${appEnv}`,
    });

    // log group for events auditing/debugging purpose
    const eventAuditLogGroup = new cdk.aws_logs.LogGroup(
      this,
      `${busName}-audit-log-group-${appEnv}`,
      {
        logGroupName: `${busName}-audit-log-group-${appEnv}`,
        retention:
          appEnv === 'production'
            ? RetentionDays.SIX_MONTHS
            : RetentionDays.THREE_MONTHS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const eventAuditRule = new Rule(this, `${busName}-rule-audit-${appEnv}`, {
      ruleName: `${busName}-rule-audit-${appEnv}`,
      description: `forwarding all eventBridge events to cloudwatch logs for auditing purpose in ${appEnv} environment`,
      eventBus,
      eventPattern: {
        account: [this.account],
        source: Match.suffix(appEnv),
      },
    });
    eventAuditRule.addTarget(
      new targets.CloudWatchLogGroup(eventAuditLogGroup),
    );
    new cdk.CfnOutput(this, 'eventBus', {
      value: eventBus.eventBusArn,
      description: `the arn of the event bus :${busName}-${appEnv}`,
      exportName: `${busName}-${appEnv}`,
    });
  }
}
