import {MiddlewareConsumer, Module, NestModule, OnModuleInit} from '@nestjs/common';


@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class ApplicationModule implements NestModule, OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onModuleInit(): any {
  }

}
