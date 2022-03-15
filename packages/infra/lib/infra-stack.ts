
import {App, Stack, StackProps} from 'aws-cdk-lib';
import {Repository} from 'aws-cdk-lib/aws-ecr';
import {Construct} from 'constructs';

interface InfraStackProps extends StackProps {
}

export class InfraStack extends Stack {

  public readonly repository: Repository;

  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    this.repository = new Repository(this, 'Repository', {});

  }
}
