pipeline {
    agent any

    stages {
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

