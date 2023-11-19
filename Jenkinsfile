pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis for Backend') {
            steps {
                script {
                    echo 'Running SonarQube analysis for backend...'
                    sh 'docker compose -f docker-compose.yml run sonar-scanner'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker compose -f docker-compose.yml down'
        }
    }
}
