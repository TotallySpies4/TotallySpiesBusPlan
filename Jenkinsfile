pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Bauen Sie die Docker Images
                    sh 'docker-compose build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Warten Sie kurz, um sicherzustellen, dass alle Dienste bereit sind
                    sh 'sleep 30'
                    // Führen Sie den Sonar-Scanner aus
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

