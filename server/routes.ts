import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Posting, Sessioning } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.post("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts() {
    return await Posting.getPosts();
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    return await Posting.create(user, content, options);
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    // TODO 3: delete the post with the given ID
    //  - require the user deleting to be the author of the post (review `updatePost` above)
    throw new Error("Not implemented!");
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
