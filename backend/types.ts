import { Request, Response } from "express";
import { Build, User } from "./src/models";

export type OptionalAuthReq<R = Request> = R & {
  user?: User;
};

export type AuthReq<R = Request> = R & {
  user: User;
};

export interface Res extends Response {}

export type BuildReq<R = OptionalAuthReq> = R & {
  build: Build;
};
