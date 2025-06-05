import { Request as ExpressRequest, Response, NextFunction } from "express";
import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/supabaseClient";

export interface AuthenticatedRequest extends ExpressRequest {
  user?: User;
  token?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (token) {
    const supabaseClient = createSupabaseServerClient(token);
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      console.warn(
        `[AuthMiddleware] Authentication error: ${
          error?.message || "No user object returned."
        }`
      );
      res.status(401).json({ message: error?.message || "Invalid token" });
      return; // Terminate response, do not call next()
    }

    // If user exists and no error, attach user to request and proceed
    req.user = user;
    req.token = token; // Store the token
    next();
  } else {
    next();
  }
};
