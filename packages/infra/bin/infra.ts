#!/usr/bin/env node
import 'source-map-support/register';

import { PipelineStack } from '../lib/pipeline-stack';
import {App} from 'aws-cdk-lib';

const REGION = 'eu-west-1';

const app = new App();

new PipelineStack(app, 'QuickstartContainerPipelineStack', {
  repositoryName: 'stevehouel/quickstart-container-pipeline',
  branchName: 'master',
  connectionArn: 'arn:aws:codestar-connections:eu-west-1:653738050483:connection/b90f8f6b-016c-43b7-bee8-3623264daf58',
  selfMutating: true,
  env: {
    region: REGION,
  },
  stages: [],
});

app.synth();

