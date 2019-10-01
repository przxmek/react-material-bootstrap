import { User } from "auth";
import ActionType from "./actionTypes";

export function setUser(user?: User) {
  return { type: ActionType.SET_USER, user };
}