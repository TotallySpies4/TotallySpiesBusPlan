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
                    sh """
                    docker run \\
                        --rm \\
                        -e SONAR_HOST_URL=http://172.22.0.3:9000 \\
                        -e SONAR_LOGIN=squ_f87b63fdded0634fcedfedbf0867f18499a391c0 \\
                        -v \$(pwd):/usr/src \\
                        sonarsource/sonar-scanner-cli
                    """
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
