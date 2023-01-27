import 'reflect-metadata';
import * as util from 'util';
import { buildSchema, MiddlewareFn } from 'type-graphql';
import { Container } from 'typedi';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { connectToDb } from 'database';
import { PhaseResolver } from './resolvers';

const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {
    console.log('Error>', util.inspect(err, { depth: null }));
    console.log('Context>', context);
    console.log('Info>', util.inspect(info, { depth: null }));

    throw err;
  }
};

async function bootstrap() {
  await connectToDb();

  const schema = await buildSchema({
    resolvers: [PhaseResolver],
    container: Container,
    globalMiddlewares: [ErrorInterceptor],
  });

  const server = new ApolloServer({
    schema,
  });

  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(`Something went wrong starting the server, ${error}`);
  }
}

bootstrap();
