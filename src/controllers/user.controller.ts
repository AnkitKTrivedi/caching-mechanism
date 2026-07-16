import { Request, Response } from "express";
import { findUser, updateUserData } from "../services/user.service";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const user = await findUser(id);
  res.json(user);
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  const userDTO = req.body;
  const user = await updateUserData(id, userDTO);
  res.json(user);
};
