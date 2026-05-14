pipeline {
    agent any

    environment {
        // Docker Image
        IMAGE_NAME = "theshreshth/teer-brand-backend:latest"

        // Container
        CONTAINER_NAME = "teer-backend"

        // Ports
        HOST_PORT = "5000"
        CONTAINER_PORT = "5000"

        // App Environment
        PORT = "5000"
        NODE_ENV = "production"

        // Jenkins Credentials
        MONGO_URI = credentials('mongo-uri')
        JWT_SECRET = credentials('jwt-secret')
        RAZORPAY_KEY_ID = credentials('razorpay-key-id')
        RAZORPAY_KEY_SECRET = credentials('razorpay-key-secret')
    }

    stages {

        stage('Pull Latest Docker Image') {
            steps {
                echo '📦 Pulling latest Docker image from DockerHub...'

                sh '''
                    sudo docker pull $IMAGE_NAME
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                echo '🛑 Stopping old container if running...'

                sh '''
                    sudo docker stop $CONTAINER_NAME || true
                '''
            }
        }

        stage('Remove Old Container') {
            steps {
                echo '🗑️ Removing old container if exists...'

                sh '''
                    sudo docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                echo '🚀 Starting new container...'

                sh '''
                    sudo docker run -d \
                    -p $HOST_PORT:$CONTAINER_PORT \
                    -e PORT=$PORT \
                    -e NODE_ENV=$NODE_ENV \
                    -e MONGO_URI="$MONGO_URI" \
                    -e JWT_SECRET="$JWT_SECRET" \
                    -e RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID" \
                    -e RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET" \
                    --name $CONTAINER_NAME \
                    --restart unless-stopped \
                    $IMAGE_NAME
                '''
            }
        }

        stage('Cleanup Old Docker Images') {
            steps {
                echo '🧹 Cleaning unused Docker images...'

                sh '''
                    sudo docker image prune -af || true
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Checking running containers...'

                sh '''
                    sudo docker ps
                '''
            }
        }
    }

    post {

        success {
            echo '✅ Deployment Successful!'
        }

        failure {
            echo '❌ Deployment Failed!'
        }

        always {
            echo '📋 Pipeline execution completed.'
        }
    }
}