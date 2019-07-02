const shell = require('shelljs')
const chalk = require('chalk')

process.stdout.write(chalk.yellow('Cleanup started...'));

shell.rm('-rf', 'src/components/_*');
shell.rm('-rf', 'src/configures/_*');
shell.rm('-rf', 'src/hooks/_*');

process.stdout.write(' ✅\n')
process.stdout.write(chalk.yellow('Update started...'));

shell.cp('template/src/components/*', 'src/components/');
shell.cp('template/src/configures/*', 'src/configures/');
shell.cp('template/src/hooks/*', 'src/hooks/');

process.stdout.write(' ✅')

