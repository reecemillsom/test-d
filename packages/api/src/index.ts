import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { connectToDb } from 'database';
import { PhaseResolver } from './resolvers';

async function bootstrap() {
  await connectToDb();

  const schema = await buildSchema({
    resolvers: [PhaseResolver],
    container: Container,
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
