pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                 withSonarQubeEnv('Sonar') {
                            sh '${env.sonar-scanner}'
                   }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script{
                    withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
                        sh 'docker build -t khanhlinh02/app:latest . '
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script{
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

