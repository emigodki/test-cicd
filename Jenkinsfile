pipeline {
 agent any
 stages {
 stage('Build') {
 steps { sh 'docker build -t mi-app-web:${BUILD_NUMBER} .' }
 }
 stage('Test') {
 steps { sh 'curl -f http://localhost:8080/health || exit 1' }
 }
 stage('Deploy') {
 steps {
 sh 'docker rm -f app-web || true'
 sh 'docker run -d -p 8080:3000 --name app-web mi-app-web:${BUILD_NUMBER}'
 }
 }
 }
}
