import {Construct} from 'constructs';
import {CfnOutput, Stage, StageProps} from 'aws-cdk-lib';
import {BuildStack} from './build-stack';

export interface BuildStageProps extends StageProps {
}

export class BuildStage extends Stage {

  public readonly repositoryUri: CfnOutput;
  public readonly repositoryName: CfnOutput;

  constructor(scope: Construct, id: string, props: BuildStageProps) {
    super(scope, id, props);

    const buildStack = new BuildStack(this, 'BuildStack', {});

    this.repositoryUri = buildStack.repositoryUri;
    this.repositoryName = buildStack.repositoryName;

  }
}