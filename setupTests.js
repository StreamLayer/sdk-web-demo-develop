import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });
Object.assign(global, { TextDecoder, TextEncoder });