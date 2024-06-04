# Test D

## Notes

I did read the instructions, and I noticed it said not to use a db, however I was enjoying the test and wanted to integrate a DB, I hope this will not affect my changes to pass this test. 

I wanted to see how it would all fit together with the typegraphql and ApolloServer packages. 

## Pre-requisites

* Node - When building this I was using v14.18.1, but don't see any reason for it not to work for future versions, unless the modules are incompatible. (Haven't tested)
* NX - Mono repo technology, that can has cli commands to run
  * https://nx.dev/
* Docker - Container tool, which will be used by for a mongo database, should install
  * https://docs.docker.com/get-docker/

## Getting started

* Cd into the project and ensure you are in the root.
* Run `npm i` in the root of the package, plus all packages inside of `/packages`.
* Cd back to the root of the project
* Next we want to build all packages and ensure they do so correctly.
  * `npx nx run-many --target=build`
* You can skip the below steps **IF** you already have a mongo instance running on port 27017
  * Next we want to spin up a mongo docker container, run these commands 
    * `docker pull mongo`, this will pull the mongo image to later be able to run in a container
    * `docker image ls`, copy the image id for mongo
    * `docker run -d -p 27017:27017 <image id>`, this will run the container for the database on port 27017 which is the default mongo port. 
* Next we should be able to start the API, run the following command, in the root of the package
  * `npx nx start api`
* If you wish to run the tests, you can from the root of the project
  * `npx nx run-many --target=test`
* Happy testing :D.

## My implementation of how to reopen (undo) a task

Since a person using the application would not be able to go onto the next phase unless all tasks were completed in the previous phase, then the approach I took was the following:

* If I am multiple phases in checking tasks off, if I was to uncheck a task in Phase 1, it would mark the task and the phase as not completed { completed: false }. It would also look at future phases and set the phase and corresponding tasks to the same completed status.

## Things I would improve

* Not using beta versions of dependencies. After investigating typegraphql, compatibility with graphql v16 is broken. In order to make use of this I needed to use a beta version of typegraphql.

* I would write integration type tests for the Resolver layer in the API, to actually test what data is coming back and to confirm behaviour expected persisted correctly to the DB.

* Write a script that would bootstrap the package, e.g. install all dependencies for you, start the DB and host mongo in a container that is running.
  
* Adding of a frontend package for the application. This would involve creating another package similar to the others, but I would probably try to use a different bundler, e.g. Rollup, ParcelJS, or ViteJS over webpack, reason being although I have never used them, from investigation, it seems they promote minimal config to get up and running.
  * As for the react side itself, I probably would have for this test, used react and mobx for state management, and inside of my mobx classes have the logic to fetch / create / update data.
