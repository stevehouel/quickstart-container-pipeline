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

    this.repositoryUri = new CfnOutput(this, 'RepositoryUri', {value: buildStack.repository.repositoryUri});
    this.repositoryName = new CfnOutput(this, 'RepositoryName', {value: buildStack.repository.repositoryName});


  }
}