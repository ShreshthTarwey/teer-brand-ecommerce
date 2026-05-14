pipeline {
    agent any

    environment {
        IMAGE_NAME = "theshreshth/teer-brand-backend:latest"
        CONTAINER_NAME = "teer-backend"

        HOST_PORT = "5000"
        CONTAINER_PORT = "5000"

        MONGO_URI = credentials('mongo-uri')
        JWT_SECRET = credentials('jwt-secret')
    }

    stages {

        stage('Pull Latest Docker Image') {
            steps {
                echo 'Pulling latest Docker image from DockerHub...'
                sh 'sudo docker pull $IMAGE_NAME'
            }
        }

        stage('Stop Old Container') {
            steps {
                echo 'Stopping old container if running...'
                sh 'sudo docker stop $CONTAINER_NAME || true'
            }
        }

        stage('Remove Old Container') {
            steps {
                echo 'Removing old container if exists...'
                sh 'sudo docker rm $CONTAINER_NAME || true'
            }
        }

        stage('Run New Container') {
            steps {
                echo 'Starting new container...'

                sh '''
                    sudo docker run -d \
                    -p $HOST_PORT:$CONTAINER_PORT \
                    -e PORT=$CONTAINER_PORT \
                    -e MONGO_URI="$MONGO_URI" \
                    -e JWT_SECRET="$JWT_SECRET" \
                    --name $CONTAINER_NAME \
                    $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }

        failure {
            echo '❌ Deployment failed!'
        }
    }
}