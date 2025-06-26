import express from "express";
import supabase from "../utils/supabaseClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, body, recipients, scheduleTime, attachments } = req.body;

  if (!title || !body || !recipients || !scheduleTime) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sendAt = new Date(scheduleTime);
  const now = new Date();

  if (sendAt <= now) {
    return res
      .status(400)
      .json({ error: "Schedule time must be in the future" });
  }

  // Save to Supabase
  const { error: insertError } = await supabase
    .from("scheduled_emails")
    .insert([
      {
        subject: title,
        body,
        recipients,
        schedule_time: sendAt.toISOString(),
        status: "scheduled",
        attachments: attachments || [],
      },
    ]);

  if (insertError) {
    console.error("Supabase error:", insertError);
    return res.status(500).json({ error: "DB insert failed" });
  }

  // No setTimeout here! Cron job will handle sending.
  res.status(200).json({ message: "Email scheduled successfully" });
});

export default router;
