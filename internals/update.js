const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const chalk = require('chalk')

process.stdout.write(chalk.yellow('Cleanup...'));
shell.rm('-rf', 'src/components/_*');
shell.rm('-rf', 'src/configures/_*');
shell.rm('-rf', 'src/hooks/_*');
process.stdout.write(' ✅\n')

process.stdout.write(chalk.yellow('Update template code...'));
shell.cp('template/src/components/*', 'src/components/');
shell.cp('template/src/configures/*', 'src/configures/');
shell.cp('template/src/hooks/*', 'src/hooks/');
process.stdout.write(' ✅\n')

process.stdout.write(chalk.yellow('Update dependencies...'));
const currentPkg = require(path.resolve(process.cwd(), 'package.json'));
const newPkg = require(path.resolve(process.cwd(), 'template/package.json'));
currentPkg.dependencies = Object.assign({}, currentPkg.dependencies, newPkg.dependencies)
currentPkg.devDependencies = Object.assign({}, currentPkg.devDependencies, newPkg.devDependencies)
fs.writeFileSync('package.json', JSON.stringify(currentPkg, null, 2))
process.stdout.write(' ✅\n')