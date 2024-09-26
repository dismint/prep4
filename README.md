# 6.1040 MongoDB recitation prep

## Getting Started

Run `npm install` to install dependencies.

## Creating MongoDB Atlas Instance
To run the server, you need to create a MongoDB Atlas instance and connect your project. Feel free to follow the instructions below or use these [slides](https://docs.google.com/presentation/d/1HJ4Lz1a2IH5oKu21fQGYgs8G2irtMqnVI9vWDheGfKM/edit?usp=sharing).
1. Create your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
2. When selecting a template, choose the __free__ option, M0.
4. At the Security Quickstart page, select how you want to authenticate your connection and keep the rest of the defaults. Make sure to allow access to all IPs as shown in [this slide](https://docs.google.com/presentation/d/1HJ4Lz1a2IH5oKu21fQGYgs8G2irtMqnVI9vWDheGfKM/edit#slide=id.g167b96ecbf8_0_0).
5. Once created, click the __CONNECT__ button, select __driver__, and copy the srv connection string. If using username and password, the url should look something like this: `mongodb+srv://<username>:<password>@cluster0.p82ijqd.mongodb.net/?retryWrites=true&w=majority`. Make sure to replace username and password with your actual values.
6. Now go to your project files and create a new file at the root directory called `.env` (don't forget the 'dot' at the front). Add the line (without `<` and `>`)
    ```
    MONGO_SRV=<connection url>
    ```
    to the `.env` file. 

__Congrats!__ You're ready to run locally! Don't hesitate to reach out if you run into issues. 

## Using MongoDB

To understand how to perform different create/read/update/delete (CRUD) operations on your MongoDB database, read `server/framework/doc.ts`, which is a simple wrapper around the native driver. You will use these functions to help you solve the `TODOs` for this prep.

Read MongoDB's documentation on [fundamental CRUD operations](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/) to see how filters and queries work.

Read [how to filter](https://docs.google.com/document/d/1M7PaJmkaOFcwKB6O04-CcJMf1inMhzCl/edit) in MongoDB.

## Complete TODOs 1, 2, & 3

TODOs 1 and 2 are in `server/concepts/authenticating.ts` and TODO 3 is in `server/routes.ts`.

You should not need to modify any other code.

After completing TODO 1, *get session user* should work in the manual testing client described below.

After TODO 2: *update username*. (Check your understanding: if you create a post, will you still be the author of that post if you change your username?)

And after TODO 3: *delete post*. (Check your work: create a post as one user, then log out and log in as a different user, and see that deleting the post fails.)

## Running Locally

Run `npm start` to start the server and the testing client.
If you make changes to code, you need to manually restart the server.

Run `npm run watch` to watch for changes and restart the server automatically.
Note that this is not recommended when actively developing;
use this when testing your code so your small changes get reflected in the server.

## Testing

There is a testing client under `public` directory.
Locate to `http://localhost:3000` (or a different port if you changed it) to see the testing client.

Keep in mind that we are using `MongoStore` for session management,
so your session will be persisted across server restarts.

## Understanding the Structure

The main entry point to the server is `api/index.ts`.
This is how the server is started and how the routes are registered.

The code for the server is under `server/` directory,
which includes both concept and RESTful API implementations.

Here's an overview of the files and directories.
First, concept implementations:
- `server/concepts` contains the concept implementations.
Note that we try to keep concepts as modular and generic as possible.
- `server/concepts/errors.ts` contains the base error classes you can
either directly use or extend from. You are free to add more base errors
in that file if you need to
(e.g., if your route needs to return [I am a teapot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418) error).

Framework code:

- `framework/router.ts` contains the framework code that does the magic to convert your
route implementations and error handling into Express handlers.
Editing this file is not recommended.
- `framework/doc.ts` defines a convenient wrapper around MongoDB. You may want to edit this file.

Server implementation:

- `server/app.ts` contains your app definition (i.e., concept instantiations).
- `server/db.ts` contains the MongoDB setup code. You should not need to edit this file.
- `server/routes.ts` contains the code for your API routes.
Try to keep your route definitions as simple as possible.
