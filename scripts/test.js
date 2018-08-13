const execa = require('execa')
const minimist = require('minimist')

const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)

let regex
if (args.p) {
  const packages = (args.p || args.package).split(',').join('|')
  regex = `.*@vuepress/(${packages}|plugin-(${packages}))/.*\\.spec\\.js$`
  const i = rawArgs.indexOf('-p')
  rawArgs.splice(i, 2)
}

console.log(regex)

;(async () => {
  const jestArgs = [
    '--env', 'node',
    '--config', 'scripts/jest.config.js',
    '--runInBand',
    ...rawArgs,
    ...(regex ? [regex] : [])
  ]
  console.log(`running jest with args: ${jestArgs.join(' ')}`)
  await execa('jest', jestArgs, {
    stdio: 'inherit'
  })
})().catch(err => {
  err
  process.exit(1)
})