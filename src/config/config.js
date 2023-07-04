import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program
    .option('-p --port <port>', 'Execution port', 8080)
    .option('-m --mode <mode>', 'Execution mode (PRODUCTION / DEVELOPMENT)', 'DEVELOPMENT')
    .parse(process.argv);
const options = program.opts();

dotenv.config({ path: options.mode == 'DEV' ? './.env.development': './.env.production' });

const config = {
    VERSION: process.env.VERSION,
    SERVER_PORT: process.env.SERVER_PORT,
    MONGOOSE_URL: process.env.MONGOOSE_URL
}

export default config;