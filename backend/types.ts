import { UserModel } from "./src/models/User";
import { Request, Response } from "express";
import { BuildModel } from "./src/models/Build";

export interface OptionalAuthReq extends Request {
  user?: UserModel;
}

export interface AuthReq extends OptionalAuthReq {
  user: UserModel;
}

export interface Res extends Response {}

export interface BuildReq extends OptionalAuthReq {
  build: BuildModel;
}
