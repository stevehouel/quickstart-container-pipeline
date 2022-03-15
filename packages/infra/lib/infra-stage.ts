import {Construct} from 'constructs';
import {Stage, StageProps} from 'aws-cdk-lib';
import {InfraStack} from './infra-stack';

export interface InfraStageProps extends StageProps {
}

export class InfraStage extends Stage {

  constructor(scope: Construct, id: string, props?: InfraStageProps) {
    super(scope, id, props);

    const infraStack = new InfraStack(this, 'InfraStack', {

    });

  }
}