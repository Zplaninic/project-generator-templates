const fs = require('fs')
const path = require('path')

const appDir = path.dirname(require.main.filename)

const CHOICES = fs.readdirSync(`${appDir}/templates`)
console.log(CHOICES)

const QUESTIONS = [
    {
        name: 'project-choice',
        type: 'list',
        message: 'What project would you like to create?',
        choices: CHOICES
    },
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: function (input) {
            if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true
            else
                return 'Project name may only include letters, numbers, underscores and hashes.'
        }
    },
    {
        name: 'install-node-modules',
        type: 'list',
        message: 'Do you want to install node_modules inside new project',
        choices: ['yes', 'no']
    }
]

module.exports = QUESTIONS
