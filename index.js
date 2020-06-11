#!/usr/bin/env node
const inquirer = require('inquirer')
const fs = require('fs')

const CURRENT_DIR = process.cwd()
const CHOICES = fs.readdirSync(`${__dirname}/templates`)

const QUESTIONS = [
    {
        name: 'project-choice',
        type: 'list',
        message: 'What project would you like to create?',
        choices: CHOICES,
    },
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: function (input) {
            if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true
            else
                return 'Project name may only include letters, numbers, underscores and hashes.'
        },
    },
]

inquirer.prompt(QUESTIONS).then((answers) => {
    const projectChoice = answers['project-choice']
    const projectName = answers['project-name']
    const templatePath = `${__dirname}/templates/${projectChoice}`

    fs.mkdirSync(`${CURRENT_DIR}/${projectName}`)

    createDirectoryTemplate(templatePath, projectName)
})

function createDirectoryTemplate(templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath)

    filesToCreate.map((file) => {
        const originalFilePath = `${templatePath}/${file}`

        const stats = fs.statSync(originalFilePath)

        if (stats.isFile()) {
            const fileContent = fs.readFileSync(originalFilePath, 'utf8')

            const writePath = `${CURRENT_DIR}/${newProjectPath}/${file}`
            fs.writeFileSync(writePath, fileContent, 'utf8')
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURRENT_DIR}/${newProjectPath}/${file}`)

            createDirectoryTemplate(
                `${templatePath}/${file}`,
                `${newProjectPath}/${file}`,
            )
        }
    })
}
