pipeline {
    agent any

    stages {
        stage('Prepull Docker Images') {
                steps {
                    sh 'docker pull sonarqube:latest'
                    sh 'docker pull postgres:latest'
                    // Fügen Sie hier weitere Docker-Images hinzu, die vorgezogen werden sollen
                }
            }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Start SonarQube and Database') {
            steps {
                script {

                    sh 'docker-compose up -d sonarqube db'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {

                    sh 'docker-compose up sonar-scanner'
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

