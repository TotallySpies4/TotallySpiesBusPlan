pipeline {
    agent any
    tools{
        jdk 'java11'
    }
    stages {
        stage('Build') {
            steps {
                sh 'java -version'
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('Sonar') {
                        sh 'echo $sonar_scanner'
                        sh """
                        ${env.sonar_scanner} \\
                        --add-opens java.base/java.lang=ALL-UNNAMED \\
                        -Dsonar.projectKey=totallyspies \\
                        -Dsonar.projectName=totallyspies \\
                        -Dsonar.projectVersion=1.0 \\
                        -Dsonar.sources=backend/src,frontend/src,lstmModel/src \\
                        -Dsonar.tests=backend/test,lstmModel/test \\
                        -Dsonar.sourceEncoding=UTF-8
                        -Dsonar.properties=sonar-project.properties
                        """
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
                        sh 'docker build -t khanhlinh02/app:latest . '
                    }
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
                        sh 'docker push khanhlinh02/app:latest'
                    }
                }
            }
        }
        stage('Builds to S3') {
            steps {
                script {
                        // Define the build directory outside any step
                                            def buildDir = "/var/lib/jenkins/jobs/'totally spies'/branches/${BRANCH_NAME}/builds/${BUILD_NUMBER}/"

                                            // Upload the build archive to S3 (customize bucket and file details)
                                            s3Upload(
                                                source: "${buildDir}/build_archive.zip",
                                                bucket: 'totally-bucket',
                                                key: "builds/${BRANCH_NAME}/${BUILD_NUMBER}/build_archive.zip",
                                                acl: 'private'
                                            )
                                            sh "rm ${WORKSPACE}/build_archive.zip"
                }
            }
        }

    }
    post {
        always {
            echo 'Prozess abgeschlossen.'
        }
    }
}
