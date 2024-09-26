import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  username: string;
  password: string;
}

/**
 * concept: Authenticating
 */
export default class AuthenticatingConcept {
  public readonly users: DocCollection<UserDoc>;

  /**
   * Make an instance of Authenticating.
   */
  constructor(collectionName: string) {
    this.users = new DocCollection<UserDoc>(collectionName);
  }

  async create(username: string, password: string) {
    await this.assertGoodCredentials(username, password);
    const _id = await this.users.createOne({ username, password });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  private redactPassword(user: UserDoc): Omit<UserDoc, "password"> {
    // eslint-disable-next-line
    const { password, ...rest } = user;
    return rest;
  }

  async getUserById(_id: ObjectId) {
    // TODO 1: implement this operation
    //  - use this.users.readOne(..)
    //  - don't include the password (we've provided a helper function you can use!)
    throw new Error("Not implemented!");
  }

  async getUsers(username?: string) {
    // If username is undefined, return all users by applying empty filter
    const filter = username ? { username } : {};
    const users = (await this.users.readMany(filter)).map(this.redactPassword);
    return users;
  }

  async authenticate(username: string, password: string) {
    const user = await this.users.readOne({ username, password });
    if (!user) {
      throw new NotAllowedError("Username or password is incorrect.");
    }
    return { msg: "Successfully authenticated.", _id: user._id };
  }

  async updateUsername(_id: ObjectId, username: string) {
    // TODO 2: implement this operation
    //  - use this.users.partialUpdateOne(..)
    //  - maintain the invariant that usernames are unique (we've provided a helper function!)
    throw new Error("Not implemented!");
  }

  async delete(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "User deleted!" };
  }

  async assertUserExists(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  private async assertGoodCredentials(username: string, password: string) {
    if (!username || !password) {
      throw new BadValuesError("Username and password must be non-empty!");
    }
    await this.assertUsernameUnique(username);
  }

  private async assertUsernameUnique(username: string) {
    if (await this.users.readOne({ username })) {
      throw new NotAllowedError(`User with username ${username} already exists!`);
    }
  }
}
