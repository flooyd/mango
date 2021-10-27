import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as child from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });
  const odotaparser = child.spawn('java', [
    '-jar',
    '../odotaparser/stats-0.1.0.jar',
  ]);
  await app.listen(8080);
  process.on('exit', () => odotaparser.kill());
}

bootstrap();
