/* @flow */

import schema from './schema';

export default {
  uri: '/aws',
  schema,
  title: 'AWS Cloud API wrapper',
  description:
    'This schema provides full API available in the <a href="https://github.com/aws/aws-sdk-js" target="_blank">official aws-sdk js client</a>.',
  github: 'https://github.com/graphql-compose/graphql-compose-aws',
  queries: [
    {
      title: 'AWS EC2 instance list',
      query: `

# ✋ 🛑 Please provide you credentials for obtaining working demo.
# ✋ 🛑 You need to wait about 30 seconds, before documentation and
# autocompletion became avaliable. Needs to download about
# 9MB schema introspection. Free Heroku account is not so fast, sorry.

query {
  aws(config: {
    accessKeyId: "---> YOUR_KEY <---",
    secretAccessKey: "---> YOUR_SECRET <---",
  }) {
    ec2(
      config: {
        region: "eu-central-1"
      }
    ) {
      describeInstances {
        Reservations {
          Instances {
            AmiLaunchIndex
            ImageId
            InstanceId
            InstanceType
            KernelId
            KeyName
            LaunchTime
            Platform
            PrivateDnsName
            PrivateIpAddress
            PublicDnsName
            PublicIpAddress
            RamdiskId
            StateTransitionReason
            SubnetId
            VpcId
            Architecture
            ClientToken
            EbsOptimized
            EnaSupport
            Hypervisor
            InstanceLifecycle
            RootDeviceName
            RootDeviceType
            SourceDestCheck
            SpotInstanceRequestId
            SriovNetSupport
            VirtualizationType
          }
          OwnerId
          RequesterId
          ReservationId
        }
      }
    }
  }
}
      `,
    },
    {
      title: 'Several AWS API calls in one query with different services and regions',
      query: `

# ✋ 🛑 Please provide you credentials for obtaining working demo.
# ✋ 🛑 You need to wait about 30 seconds, before documentation and
# autocompletion became avaliable. Needs to download about
# 9MB schema introspection. Free Heroku account is not so fast, sorry.

query {
  aws(config: {
    accessKeyId: "---> YOUR_KEY <---",
    secretAccessKey: "---> YOUR_SECRET <---",
  }) {
    s3 {
      listBuckets {
        Buckets {
          Name
          CreationDate
        }
      }
    }
    ec2 {
      euCentralVolumes: describeVolumes(
        config: { region: "eu-central-1" }
      ) {
        ...VolumeData
      }

      euWestVolumes: describeVolumes(
        config: { region: "eu-west-1" }
      ) {
        ...VolumeData
      }
    }
  }
}

fragment VolumeData on AwsEC2DescribeVolumesOutput {
  Volumes {
    AvailabilityZone
    CreateTime
    Size
    SnapshotId
    State
    VolumeId
    Iops
    VolumeType
  }
}
      `,
    },
  ],
};
