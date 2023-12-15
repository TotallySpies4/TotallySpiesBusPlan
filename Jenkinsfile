pipeline {
    agent any
    tools{
        jdk 'java11'
    }
    stages {
        stage('Build') {
            steps {
                sh 'java -version'
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('Sonar') {
                        sh 'echo $sonar_scanner'
                        sh """
                        ${env.sonar_scanner} \\
                        -Dsonar.projectKey=totallyspies \\
                        -Dsonar.projectName=totallyspies \\
                        -Dsonar.projectVersion=1.0 \\
                        -Dsonar.sources=backend/src,frontend/src,lstmModel/src \\
                        -Dsonar.tests=backend/test,lstmModel/test \\
                        -Dsonar.sourceEncoding=UTF-8
                        -Dsonar.properties=sonar-scanner.properties
                        """
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
                        sh 'docker build -t khanhlinh02/app:latest . '
                    }
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
                        sh 'docker push khanhlinh02/app:latest'
                    }
                }
            }
        }

    }
    post {
        always {
            echo 'Prozess abgeschlossen.'
            // Schritt 1: Pfad zum Build-Verzeichnis generieren
                        def buildDir = "/var/lib/jenkins/jobs/'totally spies'/branches/${BRANCH_NAME}/builds/${BUILD_NUMBER}/"

                        // Schritt 2: Build-Verzeichnis in eine ZIP-Datei komprimieren
                        sh "cd ${buildDir} && zip -r ${WORKSPACE}/build_archive.zip *"

                        // Schritt 3: ZIP-Archiv zu S3 hochladen
                        s3Upload(
                            bucket: 'Ihr-S3-Bucket-Name',
                            file: "${WORKSPACE}/build_archive.zip",
                            path: "builds/totally-spies/${BRANCH_NAME}/${BUILD_NUMBER}/build_archive.zip"
                        )

                        // Optional: ZIP-Archiv löschen, um Speicherplatz freizugeben
                        sh "rm ${WORKSPACE}/build_archive.zip"
        }
    }
}
