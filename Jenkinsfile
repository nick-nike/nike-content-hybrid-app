#!groovy
@Library(['cicd-pipeline', 'cop-pipeline-configuration@c4c-ncp', 'cop-pipeline-step'])
def appId = "c4c-npc-react-project-template"
def config = [
    profile : [
        teamcommon     : 'team/feeds/c4c/common.groovy',
        domain         : 'team/feeds/c4c/common-pym.groovy',
        stackcommon    : 'team/feeds/c4c/common-s3.groovy',
    ],
    application: [
        name: appId,
    ],
    additionalStashes : [
        buildFragment: [
            includes: "dist/"
        ],
    ],
    cache: [
        strategy: 'mountAsDockerVolume',
        tool: 'npm'
    ],
    buildFlow: [
        PULL_REQUEST : [],
        DEVELOPMENT : ["Build", "Compile"],
        RELEASE : [],
    ],
    branchMatcher: [
        RELEASE: ['main'],
        DEVELOPMENT: ['^(?!main$).*$']
    ],
    localTest: [
            image: 'artifactory.nike.com.cn:9002/cafi/nike-debian-slim-node20-foundation:latest',
            cmd: "npm test && npm run lint",
            archives: ['reports']
    ],
    build: [
        image    : "artifactory.nike.com.cn:9002/cafi/nike-debian-slim-node20-foundation:latest",
        cmd      : "npx pnpm install && npm run build",
        artifacts        : ['dist/'],
        cache            : [
            strategy     : 'mountAsDockerVolume',
            isolation    : 'pipeline',
            dirs         : ['~/.local/share/pnpm/store'],
            tool         : 'sbt',
        ]
    ],
    qma: [ configFile: 'quality-config.yaml' ],
    deploymentEnvironment: [
        test: [
            deployFlow: [
                DEVELOPMENT    : ['S3Publish']
            ],
            aws: [
                    region : "cn-northwest-1"
            ],
            s3 : [
                    bucket: "c4c-ncp-react-project-temaplte",
                    target: "",
                    source: "dist"
            ]
        ]
    ]
]

node {
    config = mergeConfiguration(config)
}

s3PublishPipeline(config)