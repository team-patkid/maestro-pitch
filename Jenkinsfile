node {
    def nodejsHome = tool 'NodeJs 18.17.0'
    env.PATH = "${nodejsHome}/bin:${env.PATH}"

    try {
      stage('ssh-test') {
        sshagent (credentials: ['79ac0389-d078-4099-81e5-96bff12a2672']) {
          sh "ssh -o StrictHostKeyChecking=no ${env.TARGET_HOST} 'uptime'"
        }
      }
      stage('git pull origin main') {
        sshagent (credentials: ['79ac0389-d078-4099-81e5-96bff12a2672']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${env.TARGET_HOST} '
            cd projectP/maestro-pitch
            git fetch
            git pull origin main
          '
          """
        }
      }
      stage('test-unit') {
        sshagent (credentials: ['79ac0389-d078-4099-81e5-96bff12a2672']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${env.TARGET_HOST} '
            cd projectP/maestro-pitch
            sudo docker compose -f docker-compose-test.yaml run backend npm run test
          '
          """
        }
      }
      stage('start nest') {
        sshagent (credentials: ['79ac0389-d078-4099-81e5-96bff12a2672']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${env.TARGET_HOST} '
            cd projectP/maestro-pitch
            sudo docker compose --env-file ./src/config/docker/.env.${BRANCH_NAME} up --build -d
          '
          """
        }
      }
    } catch (env) {
        echo 'error = ' + env
        throw env
    }
}