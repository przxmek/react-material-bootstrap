import { User } from "auth";
import ActionType from "./actionTypes";

export type RootStateType = Readonly<{
  user?: User;
}>;

const initialState: RootStateType = {
  user: undefined,
};

function rootReducer(state: RootStateType = initialState, action: any) {
  if (action.type === ActionType.SET_USER) {
    return Object.assign({}, state, {
      user: action.user,
    });
  }

  return state;
}

export default rootReducer;