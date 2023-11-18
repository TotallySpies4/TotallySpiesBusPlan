pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Holen Sie den Code aus dem Source Control Management (SCM).
                checkout scm
            }
        }

        // Backend
        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    echo 'Installing backend dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo 'Running backend tests...'
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis for Backend') {
            steps {
                dir('backend') {
                    echo 'Running SonarQube analysis for backend...'
                    sh 'sonar-scanner -Dsonar.projectKey=totallyspies -Dsonar.sources=./src -Dsonar.exclusions=**/node_modules/**,**/*.spec.js'
                }
            }
        }

        // Frontend
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    echo 'Running frontend tests...'
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis for Frontend') {
            steps {
                dir('frontend') {
                    echo 'Running SonarQube analysis for frontend...'
                    sh 'sonar-scanner -Dsonar.projectKey=totallyspies -Dsonar.sources=./src -Dsonar.exclusions=**/node_modules/**,**/*.spec.js'
                }
            }
        }
    }

    post {
        success {
            echo 'Build and analysis were successful.'
        }

        failure {
            echo 'Build or analysis failed.'
        }

        always {
            echo 'Cleaning up...'

    }
}
