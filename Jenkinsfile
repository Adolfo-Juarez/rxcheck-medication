pipeline {
    agent any

    environment {
        REMOTE_PATH = "/home/ubuntu/cart-service"
    }

    stages {
        stage('Preparar EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: params.CREDENTIAL_ID,
                                                  keyFileVariable: 'SSH_KEY_FILE',
                                                  usernameVariable: 'EC2_USER')]) {
                    sh """
chmod 600 "$SSH_KEY_FILE"
ssh-keygen -f "/var/lib/jenkins/.ssh/known_hosts" -R "${params.EC2_HOST}" || true
ssh -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no "$EC2_USER"@"${params.EC2_HOST}" << EOF
    set -e
    export DEBIAN_FRONTEND=noninteractive

    # Instalar Docker si no existe
    if ! command -v docker >/dev/null; then
        sudo apt-get update -y
        sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable" -y
        sudo apt-get update -y
        sudo apt-get install -y docker-ce
        sudo systemctl enable --now docker
    fi

    # Instalar Docker Compose si no existe
    if ! command -v docker-compose >/dev/null; then
        ARCH=\$(uname -m)
        OS=\$(uname -s)
        sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-\${OS}-\${ARCH}" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi

    # Clonar o actualizar repositorio
    if [ ! -d "${REMOTE_PATH}" ]; then
        git clone -b ${params.GIT_BRANCH} ${params.GIT_REPO} ${REMOTE_PATH}
    else
        cd ${REMOTE_PATH}
        git fetch --all
        git reset --hard origin/${params.GIT_BRANCH}
    fi
EOF
                    """
                }
            }
        }

        stage('Construir y Desplegar') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: params.CREDENTIAL_ID,
                                                  keyFileVariable: 'SSH_KEY_FILE',
                                                  usernameVariable: 'EC2_USER')]) {
                    sh """
chmod 600 "$SSH_KEY_FILE"
ssh-keygen -f "/var/lib/jenkins/.ssh/known_hosts" -R "${params.EC2_HOST}" || true
ssh -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no "$EC2_USER"@"${params.EC2_HOST}" << EOF
    set -e
    cd ${REMOTE_PATH}

    # Reconstruir imagen
    sudo docker build --build-arg JWT_SECRET="${params.JWT_SECRET}" --build-arg DATABASE_NAME="${params.DATABASE_NAME}" --build-arg DATABASE_USER="${params.DATABASE_USER}" --build-arg DATABASE_PASSWORD="${params.DATABASE_PASSWORD}" --build-arg DATABASE_HOST="${params.DATABASE_HOST}" --build-arg MAIL_HOST="${params.MAIL_HOST}" --build-arg MAIL_PORT="${params.MAIL_PORT}" --build-arg MAIL_USER="${params.MAIL_USER}" --build-arg MAIL_PASSWORD="${params.MAIL_PASSWORD}" --build-arg USER_SERVICE="${params.USER_SERVICE}" --build-arg PRODUCT_SERVICE="${params.PRODUCT_SERVICE}" --build-arg CART_SERVICE="${params.CART_SERVICE}" --build-arg ORDER_SERVICE="${params.ORDER_SERVICE}" -t cart-service .

    # Parar y eliminar contenedor si existe
    if sudo docker ps -a --format '{{.Names}}' | grep -q '^cart-service\$'; then
        sudo docker stop cart-service || true
        sudo docker rm cart-service || true
    fi

    # Iniciar nuevo contenedor
    sudo docker run -d --name cart-service -p 3032:3032 cart-service

    sudo docker ps --filter "name=cart-service"
EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Despliegue completado con éxito!'
        }
        failure {
            echo '❌ El despliegue ha fallado.'
        }
    }
}