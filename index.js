#!/usr/bin/env node
const inquirer = require('inquirer')
const fs = require('fs')
const shell = require('shelljs')
const QUESTIONS = require('./src/utils/questions')

const CURRENT_DIR = process.cwd()

inquirer.prompt(QUESTIONS).then((answers) => {
    const projectChoice = answers['project-choice']
    const projectName = answers['project-name']
    const templatePath = `${__dirname}/templates/${projectChoice}`
    const installNodeModules = answers['install-node-modules']

    fs.mkdirSync(`${CURRENT_DIR}/${projectName}`)

    createDirectoryTemplate(templatePath, projectName)

    if (installNodeModules === 'yes') {
        toInstallNodeModules(projectName)
    }
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
                `${newProjectPath}/${file}`
            )
        }
    })
}

function toInstallNodeModules(projectName) {
    const existPackageJson = fs.existsSync(`${CURRENT_DIR}/${projectName}/package.json`)

    if (existPackageJson) {
        shell.cd(`${CURRENT_DIR}/${projectName}`)

        shell.echo('Installing node_modules..... wait a moment')

        shell.exec('npm install')
    }
}
