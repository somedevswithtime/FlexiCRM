import { Request, Response, NextFunction } from "express";
import { supabaseServiceClient } from "@/supabaseClient";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (token) {
    const {
      data: { user },
      error,
    } = await supabaseServiceClient.auth.getUser(token);

    if (user) {
      (req as any).user = user;
    } else {
      console.warn(
        `[AuthMiddleware] JWT token provided but failed to authenticate: ${
          error?.message || "No user object returned."
        }. Proceeding as anonymous.`
      );
    }
  }

  next();
};
