pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarCube') {
                    sh 'mvn sonar:sonar'
                 }
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        always {

        }
    }
}