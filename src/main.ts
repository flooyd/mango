import { NestFactory } from '@nestjs/core';
import { spawn } from 'child_process';
import path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  await app.listen(8080);
  const pathToFile = path.join(
    __dirname,
    '../../packagedParser/stats-0.1.0.jar',
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const odotaparser = spawn('java', ['-jar', pathToFile]);
}

bootstrap();
