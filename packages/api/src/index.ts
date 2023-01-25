import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PhaseResolver } from './resolvers';

async function bootstrap() {
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
    console.error(`something went wrong ${error}`);
  }
}

bootstrap();
