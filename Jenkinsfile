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
                    // Stellen Sie sicher, dass das Arbeitsverzeichnis die docker-compose.yml Datei enthält
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
