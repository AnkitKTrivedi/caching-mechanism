import { Request, Response } from "express";
import { findUser } from "../services/user.service";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const user = await findUser(id);
  res.json(user);
};
