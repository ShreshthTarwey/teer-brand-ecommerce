# Teer Brand - DevOps Ready E-Commerce Platform

Teer Brand is a scalable, full-stack e-commerce application designed for a premium shopping experience. Built using the **MERN Stack** (MongoDB, Express, React, Node.js), the project has been architected into a production-grade, DevOps-ready platform using **Docker, Jenkins, AWS EC2, and GitHub Actions**.

**Live Frontend Demo:** [https://teerbrand.vercel.app/](https://teerbrand.vercel.app/)

---

## 🏗️ Architecture Overview

The application follows a modern CI/CD architecture:
- **Frontend**: Hosted on Vercel for global CDN edge delivery.
- **Backend**: Containerized via Docker and deployed on an AWS EC2 Ubuntu Server.
- **Database**: MongoDB Atlas handles data persistence securely in the cloud.
- **CI/CD Pipeline**: 
  - **GitHub Actions** automates image building and registry push to Docker Hub.
  - **Jenkins** (running on AWS EC2) handles Continuous Deployment (CD), pulling source code, building the image on the server (or pulling the latest), and rolling out container updates with zero-downtime patterns.

---

## 🛠️ Technologies Used

### **Development Stack**
*   **Frontend**: React.js, Redux, Context API, Framer Motion, Axios
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB Atlas (NoSQL)
*   **Security & Auth**: JWT (JSON Web Tokens), Bcrypt.js
*   **Integrations**: Razorpay, EmailJS/Nodemailer

### **DevOps & Deployment Stack**
*   **Containerization**: Docker, Docker Hub
*   **CI Pipeline**: GitHub Actions
*   **CD Pipeline**: Jenkins
*   **Cloud Infrastructure**: AWS EC2 (Ubuntu LTS)
*   **Version Control**: Git, GitHub

---

## 🔄 Docker Workflow

1. **Dockerfile**: Defined inside the `server/` folder to containerize the Node.js app using `node:20-alpine`. It installs dependencies using `npm ci --omit=dev`, ensuring a lightweight production build.
2. **.dockerignore**: Excludes `node_modules`, `.env`, and `.git` files to keep the Docker context small and secure.
3. **Build & Push**: The image is tagged and pushed to Docker Hub (`theshreshth/teer-brand-backend`).
4. **Execution**: The container is executed using `docker run` with specific port mappings (`-p 5000:5000`) and environment variable injections.

---

## 🚀 AWS EC2 Deployment Workflow

1. **Instance Launch**: An Ubuntu EC2 instance is launched in AWS.
2. **Security Groups**: Configured to allow SSH (Port 22), HTTP/Jenkins (Port 8080), and backend traffic (Port 5000).
3. **Environment Setup**: Docker, OpenJDK 21 (for Jenkins), and Jenkins are installed natively on the server.
4. **Hosting**: The backend container runs continuously as a background daemon securely within the EC2 instance.

---

## ⚙️ Jenkins CI/CD Workflow

1. **Trigger**: Code is pulled directly from the `main` branch.
2. **Docker Build**: Jenkins builds a new Docker image containing the latest source code changes.
3. **Container Replacement**: 
   - Jenkins gracefully stops the old running container.
   - Jenkins removes the old container to prevent naming conflicts.
4. **Redeployment**: Jenkins spins up the new Docker container exposing Port 5000 and passing essential environment variables. This creates an automated redeployment workflow.

---

## 📝 Setup & Deployment Instructions

### 1. Local Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ShreshthTarwey/Teer_Brand.git
    cd Teer_Brand
    ```

2.  **Server Setup:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add:
    ```env
    MONGO_URL=your_mongodb_connection_string
    JWT_SEC=your_jwt_secret
    PASS_SEC=your_password_secret
    RAZORPAY_KEY_ID=your_razorpay_key
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    ```
    Start the server:
    ```bash
    npm start
    ```

3.  **Client Setup:**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

### 2. AWS EC2 Setup Instructions
1. Navigate to the AWS Console -> EC2 -> Launch Instance.
2. Select **Ubuntu Server LTS**.
3. Create a new Key Pair (.pem) for SSH access.
4. **Security Group Configuration**: Add the following Inbound rules:
   - `SSH` (Port `22`) - Source: `Anywhere` or `My IP`
   - `Custom TCP` (Port `5000`) - Source: `Anywhere` (For the Express backend)
   - `Custom TCP` (Port `8080`) - Source: `Anywhere` (For the Jenkins Dashboard)
5. Launch the instance and connect via SSH:
   ```bash
   ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
   ```

### 3. Docker Setup Instructions (On EC2)
Run the following commands on your EC2 instance:
```bash
sudo apt update
sudo apt install docker.io -y
docker --version
# Test Docker installation
sudo docker run hello-world
```

### 4. Jenkins Setup Instructions (On EC2)
Jenkins requires Java to run. Install Java and Jenkins:
```bash
# Install Java
sudo apt install openjdk-21-jdk -y
java --version

# Install Jenkins
wget https://pkg.jenkins.io/debian-stable/jenkins_2.504.1_all.deb
sudo dpkg -i jenkins_2.504.1_all.deb
sudo apt --fix-broken install -y

# Manage Jenkins Service
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```
Access Jenkins at `http://<your-ec2-public-ip>:8080`. Retrieve the initial admin password:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 5. Deployment Instructions (Docker Execution)
To manually deploy the backend using Docker:
```bash
# Pull the image
sudo docker pull theshreshth/teer-brand-backend

# Run the container
sudo docker run -d -p 5000:5000 -e PORT=5000 -e MONGO_URI="your_mongo_uri" -e JWT_SECRET="your_jwt_secret" --name teer-backend theshreshth/teer-brand-backend
```
To check container status and logs:
```bash
sudo docker ps
sudo docker logs teer-backend
```

---

## 🧠 Concepts & Explanations

* **Environment Variables**: Dynamic values (like Database URIs, Secret Keys) passed to the app externally to keep sensitive data out of the source code.
* **Ports & Port Mapping (`-p 5000:5000`)**: The application inside the Docker container exposes port 5000. Port mapping routes traffic from the EC2 host's port 5000 into the container's port 5000.
* **Why Expose Ports?**: To make the isolated backend application accessible to external traffic (the frontend).

---

## 🔮 Future Improvements
* Automate EC2 infrastructure provisioning using **Terraform**.
* Implement **Docker Compose** for a multi-container architecture (e.g., separating Redis for caching).
* Set up a Reverse Proxy (Nginx) and configure SSL/HTTPS via Certbot for secure backend API calls.

---

*Developed by [Shreshth Tarwey](https://github.com/ShreshthTarwey) for production-readiness.*
