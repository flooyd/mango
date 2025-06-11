import { NestFactory } from '@nestjs/core';
import { spawn } from 'child_process';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  await app.listen(8080);
  console.log('Application is running on: http://localhost:8080');

  const pathToFile = path.join(
    __dirname,
    '../packagedParser/stats-0.1.0.jar',
  );
  console.log(`Path to odotaparser: ${pathToFile}`);

  try {
    const odotaparser = spawn('java', ['-jar', pathToFile]);

    odotaparser.stdout.on('data', (data) => {
      console.log(`Java parser stdout: ${data}`);
    });

    odotaparser.stderr.on('data', (data) => {
      console.error(`Java parser stderr: ${data}`);
    });

    odotaparser.on('error', (error) => {
      console.error('Failed to start Java parser:', error);
    });

    odotaparser.on('spawn', () => {
      console.log(`Java parser started successfully with PID: ${odotaparser.pid}`);
    });

    odotaparser.on('close', (code) => {
      console.log(`Java parser process exited with code ${code}`);
    });

  } catch (error) {
    console.error('Error starting odotaparser:', error);
  }
}

bootstrap();
