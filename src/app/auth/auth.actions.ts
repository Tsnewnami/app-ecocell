import { createAction, props } from "@ngrx/store";
import { User } from "./model/user.model";

export const login = createAction(
  "[Homepage] User Login",
  props<{user: User}>()
);

export const signup = createAction(
  "[Homepage] User Login",
  props<{user: User}>()
);
