import express from "express";
import passport from "passport";
import User from "../models/user.js";
import { ensureAuthenticated } from "../middleware/auth.js";

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Step 1: Kick off Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login?error=auth_failed`,
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);

// Returns the currently logged-in user (or null)
router.get("/current_user", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(200).json({ user: null });
});

// Update profile (displayName, bio) - only these two fields are editable
router.patch("/profile", ensureAuthenticated, async (req, res, next) => {
  try {
    const { displayName, bio } = req.body;

    const updates = {};
    if (typeof displayName === "string") {
      updates.displayName = displayName.trim().slice(0, 50);
    }
    if (typeof bio === "string") {
      updates.bio = bio.trim().slice(0, 160);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
});

// Logout - destroys session
router.post("/logout", ensureAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err2) => {
      if (err2) return next(err2);
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;