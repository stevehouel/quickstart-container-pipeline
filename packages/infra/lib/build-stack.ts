
import {App, CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Repository} from 'aws-cdk-lib/aws-ecr';
import {Construct} from 'constructs';

interface BuildStackProps extends StackProps {
}

export class BuildStack extends Stack {

  public readonly repository: Repository;
  public readonly repositoryUri: CfnOutput;
  public readonly repositoryName: CfnOutput;

  constructor(scope: Construct, id: string, props: BuildStackProps) {
    super(scope, id, props);

    this.repository = new Repository(this, 'Repository', {});

    this.repositoryUri = new CfnOutput(this, 'RepositoryUri', {value: this.repository.repositoryUri});
    this.repositoryName = new CfnOutput(this, 'RepositoryName', {value: this.repository.repositoryName});
  }
}
