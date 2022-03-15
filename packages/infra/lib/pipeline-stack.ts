
import {InfraStage, InfraStageProps} from './infra-stage';
import {App, Stack, StackProps} from 'aws-cdk-lib';
import {CfnNotificationRule} from 'aws-cdk-lib/aws-codestarnotifications';
import {CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {BuildStage} from './build-stage';

export interface StageEnvironment extends InfraStageProps {
  name: string;
  testing: boolean;
}

interface PipelineStackProps extends StackProps {
  readonly selfMutating: boolean;
  readonly repositoryName: string;
  readonly branchName: string;
  readonly connectionArn: string; // Connection to Github created using the AWS console
  readonly slackChannelNotificationArn?: string;
  readonly stages: StageEnvironment[];
}

export class PipelineStack extends Stack {
  constructor(app: App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const source = CodePipelineSource.connection(props.repositoryName, props.branchName, {
      connectionArn: props.connectionArn, // Created using the AWS console * });',
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      selfMutation: false,
      synth: new ShellStep('Synth', {
        input: source,
        commands: [
          'make install',
          'make build',
          'make synth',
        ],
      }),
    });

    //Adding build stack and asset publishing step
    const buildStage = new BuildStage(this, 'BuildStage', {});
    pipeline.addStage(buildStage, {
      post: [
        new CodeBuildStep('DockerPublishStep', {
          input: source,
          commands: [
            'make docker-login',
            'make docker-build',
            'make docker-publish'
          ],
          envFromCfnOutputs: {
            IMAGE_REPO_URI: buildStage.repositoryUri
          },
          buildEnvironment: {
            privileged: true,
          }
        })
      ]
    });


    if (props.slackChannelNotificationArn) {
      // Add Notification rule
      new CfnNotificationRule(this, 'Notification',{
        detailType: 'FULL',
        name: this.stackName + 'Notifications',
        eventTypeIds: [
          'codepipeline-pipeline-pipeline-execution-failed',
          'codepipeline-pipeline-pipeline-execution-succeeded',
        ],
        resource: pipeline.pipeline.pipelineArn,
        targets: [{
          targetType: 'AWSChatbotSlack',
          targetAddress: props.slackChannelNotificationArn,
        }],
      });
    }
  }
}
