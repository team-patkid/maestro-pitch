node {
    try {
        stage('ssh-test') {
            sshagent (credentials: ['79ac0389-d078-4099-81e5-96bff12a2672']) {
                sh 'ssh -o StrictHostKeyChecking=no ${env.TARGET_HOST} "uptime"'
            }
        }
        stage('ls -al') {
            sshagent (credentials: ['79ac0389-d078-4099-81e5-96bff12a2672']) {
                sh 'ssh -o StrictHostKeyChecking=no ${env.TARGET_HOST} "uptime"'
                sh 'ls -al'
            }
        }
    } catch (env) {
        echo 'error = ' + env
        throw env
    }
}