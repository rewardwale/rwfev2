"use server";
import { signOut } from "../app/auth";
import {logout} from "../apis/home"

export const logoutAction = async () => {
  await logout()
  await signOut({redirectTo:"/login"});
};
