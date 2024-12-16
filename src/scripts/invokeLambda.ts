import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

function findCdkTemplate(): string {
  const cdkOutDir = path.join(process.cwd(), 'cdk.out');
  const files = fs.readdirSync(cdkOutDir);
  const templateFile = files.find(file => file.endsWith('.template.json'));
  
  if (!templateFile) {
    throw new Error('No CDK template file found in cdk.out directory');
  }
  
  return path.join(cdkOutDir, templateFile);
}

function findLambdaFunction(templatePath: string): string {
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  const resources = template.Resources;
  
  // Find the first Lambda function resource
  const lambdaResource = Object.entries(resources).find(
    ([_, resource]: [string, any]) => resource.Type === 'AWS::Lambda::Function'
  );
  
  if (!lambdaResource) {
    throw new Error('No Lambda function found in template');
  }
  
  return lambdaResource[0];
}

function findTestEvent(): string {
  const testEventPath = process.argv[2] || path.join(process.cwd(), 'src', 'scripts', 'testEvent.json');
  
  if (!fs.existsSync(testEventPath)) {
    throw new Error(`Test event file not found: ${testEventPath}`);
  }
  
  return testEventPath;
}

try {
  const templatePath = findCdkTemplate();
  const lambdaFunction = findLambdaFunction(templatePath);
  const testEventPath = findTestEvent();
  
  console.log(`Invoking Lambda: ${lambdaFunction}`);
  console.log(`Using template: ${templatePath}`);
  console.log(`Using test event: ${testEventPath}`);
  
  const result = spawnSync('sam', [
    'local',
    'invoke',
    lambdaFunction,
    '--template-file',
    templatePath,
    '-e',
    testEventPath
  ], { stdio: 'inherit' });
  
  process.exit(result.status || 0);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('Error:', error);
  }
  process.exit(1);
}