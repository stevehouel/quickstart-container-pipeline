#!/usr/bin/env node
import 'source-map-support/register';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { InfraStage } from '../lib/infra-stage';
import {App} from 'aws-cdk-lib';
import {InfraStack} from '../lib/infra-stack';

const configFilePath = resolve(__dirname, '../config/local-config.json');
const config = JSON.parse(readFileSync(configFilePath).toString());

const app = new App();

// Implement Infra Stage for developer environment
new InfraStage(app, 'QuickstartContainerPipelineDev', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-west-1',
  },
  ...config,
});

app.synth();
