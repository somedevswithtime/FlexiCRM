import { Request, Response, NextFunction } from "express";
import { supabase } from "@/supabaseClient";

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
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.warn(
        `[AuthMiddleware] JWT token provided but failed to authenticate: ${
          error?.message || "No user object returned."
        }. Proceeding as anonymous.`
      );
    }
    // The Supabase client instance will use the token from the header for RLS if properly configured.
    // No need to call setAuth on the shared client.
  }

  next();
};
