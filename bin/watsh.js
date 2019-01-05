#!/usr/bin/env node
'use strict'

const { execFile } = require('child_process')

const chokidar = require('chokidar')
const throttle = require('lodash.throttle')

function executeScripts(scripts) {
  scripts.forEach(script => {
    console.log(`Running script ${script}`)
    const startTime = Date.now()
    const childProcess = execFile(script, (error, stdout, stderr) => {
      if (error) {
        throw error
      }
      console.log(stdout)
      const endTime = Date.now()
      console.log(
        `Finished running script ${script} after ${endTime - startTime}ms`,
      )
    })
    console.log(`Script is running with pid ${childProcess.pid}`)
  })
}

const scripts = process.argv.splice(2)
const throttled = throttle(() => executeScripts(scripts), 1000, {
  leading: true,
})

chokidar
  .watch('.', {
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true,
  })
  .on('ready', () => throttled())
  .on('all', () => throttled())

// TODO
// Ignore default ignores
// https://github.com/novemberborn/ignore-by-default
// Give an option to pass in other files and directories to ignore
// Add automatic update checker
