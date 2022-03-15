
import {App, Stack, StackProps} from 'aws-cdk-lib';
import {Repository} from 'aws-cdk-lib/aws-ecr';
import {Construct} from 'constructs';

interface BuildStackProps extends StackProps {
}

export class BuildStack extends Stack {

  public readonly repository: Repository;

  constructor(scope: Construct, id: string, props: BuildStackProps) {
    super(scope, id, props);

    this.repository = new Repository(this, 'Repository', {});

  }
}
