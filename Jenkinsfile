pipeline {
    agent any

    stages {
        stage('Prepull Docker Images') {
                steps {
                    sh 'docker pull sonarqube:latest'
                    sh 'docker pull postgres:latest'
                }
            }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh 'npm install' // Install project dependencies
                sh 'npm test' // Run Node.js tests
                sh 'sonar-scanner -Dsonar.test.inclusions=backend/Test/**/*.test.js' // Specify test file location for SonarQube
            }
        }

        // stage('Start SonarQube and Database') {
        //     steps {
        //         script {

        //             sh 'docker-compose up -d sonarqube db'
        //         }
        //     }
        // }

        stage('SonarQube Analysis') {
            steps {
                script {

                    sh 'docker-compose up sonar-scanner'
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
            // Fahren Sie die Docker Compose-Services herunter
            sh 'docker-compose down'
            echo 'Prozess abgeschlossen.'
        }
    }
}

