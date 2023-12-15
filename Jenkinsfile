pipeline {
    agent any
    environment {
        JAVA_HOME = '/usr/lib/jvm/jre-11-openjdk'
        PATH = "$JAVA_HOME/bin:$PATH"
    }
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
                        -Dsonar.projectKey=totallyspies \\
                        -Dsonar.projectName=totallyspies \\
                        -Dsonar.projectVersion=1.0 \\
                        -Dsonar.sources=backend/src,frontend/src,lstmModel/src \\
                        -Dsonar.tests=backend/test,lstmModel/test \\
                        -Dsonar.sourceEncoding=UTF-8
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
    }
    post {
        always {
            echo 'Prozess abgeschlossen.'
        }
    }
}
