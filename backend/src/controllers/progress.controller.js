import admin from "../config/firebase.js";
const db = admin.firestore();

/* ------------------ GET METRICS ------------------ */
export const getProgressMetrics = async (req, res) => {
  try {
    const userId = req.user.id;

    const doc = await db
      .collection("progressSnapshots")
      .doc(userId)
      .get();

    if (!doc.exists) {
      return res.json({
        totalStudyMinutes: 0,
        dailyStudyMinutes: {},
        currentStreak: 0,
        longestStreak: 0
      });
    }

    res.json(doc.data());
  } catch (err) {
    console.error("getProgressMetrics error:", err);
    res.status(500).json({ message: "Failed to fetch progress metrics" });
  }
};

/* ------------------ GET BADGES ------------------ */
export const getProgressBadges = async (req, res) => {
  try {
    const userId = req.user.id;

    const snapshot = await db
      .collection("userBadges")
      .doc(userId)
      .collection("badges")
      .get();

    const badges = snapshot.docs.map(doc => doc.data());
    res.json(badges);
  } catch (err) {
    console.error("getProgressBadges error:", err);
    res.status(500).json({ message: "Failed to fetch badges" });
  }
};

/* ------------------ FOCUS COMPLETE ------------------ */
export const completeFocusSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { minutes } = req.body;

    if (!minutes || minutes <= 0) {
      return res.status(400).json({ message: "Invalid minutes" });
    }

    const today = new Date().toISOString().split("T")[0];
    const ref = db.collection("progressSnapshots").doc(userId);

    await db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const data = snap.exists ? snap.data() : {};

      const daily = data.dailyStudyMinutes || {};
      daily[today] = (daily[today] || 0) + minutes;

      const total = (data.totalStudyMinutes || 0) + minutes;

      const lastDate = data.lastStudyDate;
      let currentStreak = data.currentStreak || 0;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];

      if (lastDate === today) {
        // same day
      } else if (lastDate === yStr) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      const longestStreak = Math.max(
        currentStreak,
        data.longestStreak || 0
      );

      tx.set(
        ref,
        {
          dailyStudyMinutes: daily,
          totalStudyMinutes: total,
          currentStreak,
          longestStreak,
          lastStudyDate: today
        },
        { merge: true }
      );
    });

    res.json({ success: true });
  } catch (err) {
    console.error("completeFocusSession error:", err);
    res.status(500).json({ message: "Failed to update progress" });
  }
};
