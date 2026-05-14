# Teer Brand DevOps Project – Complete Progress & Commands Guide

## 📌 Project Goal

Convert the existing MERN stack Teer Brand e-commerce website into a production-style DevOps project using:

* Docker
* Docker Hub
* GitHub Actions (CI)
* Jenkins (CD)
* AWS EC2
* MongoDB Atlas
* Vercel (Frontend)

---

# 🏗️ Planned Architecture

```text
Frontend (React) → Vercel
                    ↓
Backend (Node + Express) → Docker Container
                            ↓
Docker Hub (Image Registry)
                            ↓
GitHub Actions (CI Pipeline)
                            ↓
Jenkins on AWS EC2 (CD Pipeline)
                            ↓
Deploy Updated Docker Container
```

---

# ✅ PHASE 1 — Backend Dockerization

---

# 📁 Backend Folder

```powershell
cd C:\\Users\\Asus\\Desktop\\Full_Stack\\Teer_Brand_MERN\\server
```

---

# 📄 Dockerfile Used

```dockerfile
FROM node:20-alpine

# Set environment to production for optimized Node.js execution
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies using a clean install for exact versions
RUN npm ci --omit=dev

# Copy the rest of the backend source code to the working directory
COPY . .

# Change ownership of the app directory to the unprivileged 'node' user
RUN chown -R node:node /usr/src/app

# Use the unprivileged user for better security (prevents root access inside container)
USER node

# Expose the port that the Express app will run on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
```

---

# 📄 .dockerignore Used

```text
# Dependency directories
node_modules/
npm-debug.log

# Environment variables
.env

# Git directories
.git/
.gitignore

# Docker configurations
Dockerfile
.dockerignore
docker-compose.yml

# Project documentation
README.md

# Operating System Files
.DS_Store
Thumbs.db
```

---

# 🛠️ Docker Commands Executed

## 1. Build Docker Image

```powershell
docker build -t teer-brand-backend .
```

---

## 2. Verify Image Creation

```powershell
docker images
```

---

## 3. Run Docker Container

```powershell
docker run -p 5000:5000 --env-file .env -d --name teer-backend-container teer-brand-backend
```

### Meaning of Port Mapping

```text
-p HOST_PORT:CONTAINER_PORT
```

Example:

```text
-p 5000:5000
```

Meaning:

```text
Laptop Port 5000 → Container Port 5000
```

---

## 4. Check Running Containers

```powershell
docker ps
```

---

## 5. Check Container Logs

```powershell
docker logs -f teer-backend-container
```

### Successful Output

```text
🚀 Server running on port 5000
✅ MongoDB Connection Successful!
```

---

## 6. Stop Container

```powershell
docker stop teer-backend-container
```

---

## 7. Remove Container

```powershell
docker rm teer-backend-container
```

---

# 🧠 Important Docker Concepts Learned

## Dockerfile

A Dockerfile is a set of instructions used to create a Docker image.

---

## Docker Image

A blueprint/template used to create containers.

---

## Docker Container

A running instance of a Docker image.

---

## Docker Layer Caching

Docker caches layers like dependency installation to make future builds faster.

---

## .dockerignore

Used to prevent unnecessary or sensitive files from being copied into the Docker build context.

Benefits:

* Smaller image size
* Faster builds
* Better security

---

# ✅ PHASE 2 — Docker Hub Integration

---

# 🌐 Docker Hub Account Creation

Website:

[https://hub.docker.com](https://hub.docker.com)

Created a public repository:

```text
teer-brand-backend
```

---

# 🔐 Docker Login

```powershell
docker login
```

---

# 🏷️ Tag Docker Image

```powershell
docker tag teer-brand-backend theshreshth/teer-brand-backend:latest
```

---

# ⬆️ Push Docker Image

```powershell
docker push theshreshth/teer-brand-backend:latest
```

---

# 🧠 Docker Hub Concept

Docker Hub works like GitHub but for Docker images.

Purpose:

* Store Docker images online
* Pull images from AWS/Jenkins later
* Share portable containerized applications

---

# ✅ PHASE 3 — GitHub Actions CI Pipeline

---

# 🎯 Goal of CI Pipeline

Automate:

```text
Git Push
   ↓
Build Docker Image
   ↓
Push Image to Docker Hub
```

---

# 🔐 Docker Access Token Creation

Website:

```text
Docker Hub → Account Settings → Security → Access Tokens
```

Created token:

```text
github-actions
```

Purpose:

* Secure authentication for GitHub Actions
* Avoid using Docker password directly

---

# 🔒 GitHub Secrets Added

Repository Path:

```text
GitHub Repository → Settings → Secrets and variables → Actions
```

Created Secrets:

| Secret Name     | Purpose                 |
| --------------- | ----------------------- |
| DOCKER_USERNAME | Docker Hub username     |
| DOCKER_PASSWORD | Docker Hub access token |

---

# 📁 GitHub Actions Folder Structure

```text
.github/
└── workflows/
    └── backend-ci.yml
```

---

# 📄 backend-ci.yml

```yaml
name: Backend CI Pipeline

on:
  push:
    branches:
      - main

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker Image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/teer-brand-backend:latest ./server

      - name: Push Docker Image
        run: |
          docker push ${{ secrets.DOCKER_USERNAME }}/teer-brand-backend:latest
```

---

# 🛠️ Git Commands Used

## Add Files

```powershell
git add .
```

---

## Commit Changes

```powershell
git commit -m "Added GitHub Actions CI pipeline"
```

---

## Push Changes

```powershell
git push origin main
```

---

# 📍 GitHub Actions Verification

Repository:

```text
GitHub Repository → Actions Tab
```

Expected Result:

```text
✅ Workflow completed successfully
```

---

# 🧠 CI/CD Concepts Learned

## CI (Continuous Integration)

Automates:

* Build process
* Testing
* Docker image creation
* Image pushing

Used Tool:

```text
GitHub Actions
```

---

## CD (Continuous Deployment)

Automates:

* Server deployment
* Pulling latest image
* Restarting containers

Planned Tool:

```text
Jenkins
```

---

# 🧠 Why Use Both GitHub Actions and Jenkins?

## GitHub Actions

Used for:

* CI automation
* Building Docker image
* Pushing image to Docker Hub

---

## Jenkins

Used for:

* Deployment automation
* Pull latest image from Docker Hub
* Restart containers on AWS EC2

---

# 🚀 Planned Future Workflow

```text
Developer Pushes Code
        ↓
GitHub Actions
(Build + Push Docker Image)
        ↓
Docker Hub
(Store Latest Image)
        ↓
Jenkins on AWS EC2
(Pull Latest Image)
        ↓
Docker Container Deployment
```

---

# ✅ PHASE 4 — AWS EC2 & Jenkins Setup (Deployment)

---

# 📌 Why AWS EC2?

AWS EC2 provides:

* Virtual Linux server
* Public IP address
* Cloud deployment environment
* Ability to run Jenkins on a dedicated server 24/7

---

# 🧠 Complete AWS EC2 Setup Steps

## 1. Launching Ubuntu Instance
1. Go to AWS Console → EC2 Dashboard.
2. Click **Launch Instance**.
3. Select **Ubuntu Server LTS** AMI.
4. Choose Instance Type (e.g., `t2.micro`).
5. Create and download a `.pem` key pair for SSH access.

## 2. Security Group Rules
Configured the security group to allow inbound traffic on specific ports:
* **Port 22 (SSH)**: To securely connect to the server from our terminal.
* **Port 5000 (Custom TCP)**: To allow internet traffic to reach our Node.js Backend container.
* **Port 8080 (Custom TCP)**: To access the Jenkins web dashboard.

## 3. Connect using SSH
```bash
ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
```

---

# 🐳 Docker Installation on EC2

Once connected to EC2, we install Docker to run our containerized application.

```bash
sudo apt update
sudo apt install docker.io -y
docker --version

# Verify Docker is running
sudo docker run hello-world
```

---

# ☕ Java Installation (Requirement for Jenkins)

Jenkins is built with Java, so it requires the Java Runtime Environment to execute.

```bash
sudo apt install openjdk-21-jdk -y
java --version
```

---

# ⚙️ Jenkins Installation & Setup

We install Jenkins directly on the EC2 machine.

```bash
# Download Jenkins package
wget https://pkg.jenkins.io/debian-stable/jenkins_2.504.1_all.deb

# Install the Jenkins package
sudo dpkg -i jenkins_2.504.1_all.deb

# Fix missing dependencies
sudo apt --fix-broken install -y
```

## Jenkins Service Commands

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```

After Jenkins is running, we access it via `http://<EC2-IP>:8080`.

---

# 🚀 Deployment Execution via Docker

These commands represent how our application runs in production on the server.

## Docker Image Commands
```bash
sudo docker pull theshreshth/teer-brand-backend
sudo docker images
```

## Docker Run Command
```bash
sudo docker run -d -p 5000:5000 -e PORT=5000 -e MONGO_URI="..." -e JWT_SECRET="..." --name teer-backend theshreshth/teer-brand-backend
```

## Container Verification
```bash
sudo docker ps
sudo docker logs teer-backend
```

---

# ✅ PHASE 5 — Deep Dive into DevOps Concepts

---

# 🧠 Core Explanations

### Why Java is required for Jenkins
Jenkins is an open-source automation server written entirely in Java. Without the Java Runtime Environment (JRE) or Java Development Kit (JDK), the Jenkins service cannot start or execute pipelines.

### Why Jenkins is used even though GitHub Actions exists
Jenkins provides immense flexibility and deep integration capabilities. It runs locally on our EC2 instance, giving us full control over the deployment environment. It integrates tightly with the machine's resources without needing to securely tunnel actions into the server from external sources. 

### Difference between GitHub Actions and Jenkins
* **GitHub Actions**: Cloud-native CI/CD seamlessly integrated into GitHub. Great for CI (Continuous Integration - building, testing, pushing images). Managed by GitHub.
* **Jenkins**: Self-hosted automation server. Great for CD (Continuous Deployment). It allows us to keep our server architecture private and pull artifacts securely when ready. Requires manual setup and maintenance.

### Why Docker is used
Docker packages our entire backend (Node.js, Express, dependencies, configuration) into an isolated standard unit called a container. This ensures our app runs *exactly* the same on our local laptop as it does on the AWS EC2 server. "It works on my machine" is solved by Docker.

### What port mapping means (`-p 5000:5000`)
By default, Docker containers are isolated and invisible to the outside world. `-p 5000:5000` maps the host EC2 machine's port `5000` to the internal Docker container's port `5000`. This allows internet traffic hitting the EC2 server to be routed into the backend application.

### Why we expose ports
Without exposing a port, the frontend React application would not be able to communicate with our Express APIs. Exposing ports punches a safe hole through the Docker isolation specifically for API traffic.

### What `.dockerignore` does
Similar to `.gitignore`, it prevents specific files or folders (like `node_modules/` or `.env`) from being copied into the Docker image. This keeps the image size small, speeds up the build process, and prevents accidental leaks of secret credentials.

### What `Dockerfile` does
A step-by-step recipe that tells Docker how to build our image. It specifies the base OS (Alpine Node), what files to copy, how to install dependencies, and the final command to start the server.

---

# 🎯 Final Resume Description (Future)

Developed and deployed a production-style MERN e-commerce platform using Dockerized backend architecture, GitHub Actions CI pipeline, Jenkins-based CD workflow, Docker Hub image registry, and AWS EC2 cloud deployment.
