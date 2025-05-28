import { Request, Response, NextFunction } from "express";
import { supabase } from "@/supabaseClient"; // Adjust path if needed

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
    const { error } = await supabase.auth.setAuth(token);
    if (error) {
      console.warn(
        `[AuthMiddleware] JWT token provided but failed to set auth: ${error.message}. Proceeding as anonymous.`
      );
      // Ensure it's explicitly anonymous if token was bad
      await supabase.auth.setAuth(null);
    }
    // If successful, the supabase client now has this user's auth context
  } else {
    // No token, ensure client is in anonymous state
    await supabase.auth.setAuth(null);
  }

  next();
};
