pipeline {
    agent any

    tools {
        jdk 'java11'
        nodejs 'node18'
    }

    environment {
        // Definieren Sie die Variable für den Docker-Image-Name
        IMAGE_NAME = "siri0000/totallydockerhub"
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
                        -Dsonar.projectKey=totallyspies \\
                        -Dsonar.projectName=totallyspies \\
                        -Dsonar.projectVersion=1.0 \\
                        -Dsonar.sources=backend/src,frontend/src,lstmModel/src \\
                        -Dsonar.tests=backend/test,lstmModel/test \\
                        -Dsonar.sourceEncoding=UTF-8\\
                        -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
                        -Dsonar.python.coverage.reportPaths=lstmModel/coverage.xml

                        """
                    }
                }
            }
        }
        stage('Build and Push Docker Images with Docker Compose') {
                    steps {
                        script {
                            withDockerRegistry(url: 'https://index.docker.io/v1/', credentialsId: 'dockerhub') {
                            sh 'docker-compose build'
                            sh 'docker-compose push'
                            }
                        }
                    }
                }
        stage('Trigger ManifestUpdate') {
            steps {
                echo 'Triggering ManifestUpdate'
                build job: 'ManifestUpdate', parameters: [
                    string(name: 'DOCKERTAG', value: "${env.BUILD_NUMBER}")
                ]
            }
        }
    }

    post {
        always {
            echo 'Prozess abgeschlossen.'
        }
    }
}
