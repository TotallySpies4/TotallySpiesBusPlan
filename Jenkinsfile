pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Holen Sie den Code aus dem Source Control Management (SCM).
                checkout scm
            }
        }

        /*stage('Backend Tests') {
            steps {
                script {
                    // Starten Sie den Testservice, der in Ihrer docker-compose.yml definiert ist.
                    // Stellen Sie sicher, dass dieser Service so konfiguriert ist, dass er npm test oder den entsprechenden Testbefehl ausführt.
                    sh 'docker compose -f docker-compose.yml run backend-tests'
                }
            }
        }

        // Weitere Schritte für den Build, SonarQube-Analyse usw.
    }

    post {
        always {
            // Aktionen, die immer durchgeführt werden, egal ob der Build erfolgreich war oder fehlgeschlagen ist.
            echo 'Cleaning up...'
            sh 'docker compose -f docker-compose.yml down'
        }*/
        stage('SonarQube Analysis for Backend') {
                        steps {
                            dir('backend') {
                                echo 'Running SonarQube analysis for backend...'
                                sh 'sonar-scanner -Dsonar.projectKey=YourBackendProjectKey -Dsonar.sources=./src -Dsonar.exclusions=**/node_modules/**,**/*.spec.js'
                            }
                        }
                    }
    }

}
