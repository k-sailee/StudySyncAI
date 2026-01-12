import express from 'express';
import admin, { db } from '../config/firebase.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper to convert Firestore timestamp to ISO
const tsToISO = (ts) => {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate().toISOString();
  return new Date(ts).toISOString();
};

// Get all mind maps for current user
router.get('/', auth, async (req, res) => {
  try {
    const uid = req.user?.id;
    const snapshot = await db
      .collection('mindmaps')
      .where('userId', '==', uid)
      .orderBy('updatedAt', 'desc')
      .get();

    const maps = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        title: data.title,
        createdAt: tsToISO(data.createdAt),
        updatedAt: tsToISO(data.updatedAt),
      };
    });

    res.json(maps);
  } catch (error) {
    console.error('Mindmaps GET / error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific mind map
router.get('/:id', auth, async (req, res) => {
  try {
    const doc = await db.collection('mindmaps').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Mind map not found' });

    const data = doc.data();
    if (!data || data.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Mind map not found' });
    }

    res.json({
      _id: doc.id,
      userId: data.userId,
      title: data.title,
      nodes: data.nodes || [],
      createdAt: tsToISO(data.createdAt),
      updatedAt: tsToISO(data.updatedAt),
    });
  } catch (error) {
    console.error('Mindmaps GET /:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new mind map
router.post('/', auth, async (req, res) => {
  try {
    const { title, nodes } = req.body;
    if (!title || !nodes || !Array.isArray(nodes)) {
      return res.status(400).json({ message: 'Title and nodes are required' });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const payload = {
      userId: req.user?.id,
      title,
      nodes,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection('mindmaps').add(payload);
    const created = await ref.get();
    const data = created.data();

    res.status(201).json({
      _id: ref.id,
      userId: data.userId,
      title: data.title,
      nodes: data.nodes || [],
      createdAt: tsToISO(data.createdAt),
      updatedAt: tsToISO(data.updatedAt),
    });
  } catch (error) {
    console.error('Mindmaps POST / error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a mind map
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, nodes } = req.body;
    const ref = db.collection('mindmaps').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Mind map not found' });

    const data = doc.data();
    if (!data || data.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Mind map not found' });
    }

    const updatePayload: any = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (title !== undefined) updatePayload.title = title;
    if (nodes !== undefined) updatePayload.nodes = nodes;

    await ref.update(updatePayload);
    const updatedDoc = await ref.get();
    const updatedData = updatedDoc.data();

    res.json({
      _id: updatedDoc.id,
      userId: updatedData.userId,
      title: updatedData.title,
      nodes: updatedData.nodes || [],
      createdAt: tsToISO(updatedData.createdAt),
      updatedAt: tsToISO(updatedData.updatedAt),
    });
  } catch (error) {
    console.error('Mindmaps PUT /:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a mind map
router.delete('/:id', auth, async (req, res) => {
  try {
    const ref = db.collection('mindmaps').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Mind map not found' });

    const data = doc.data();
    if (!data || data.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Mind map not found' });
    }

    await ref.delete();
    res.json({ message: 'Mind map deleted successfully' });
  } catch (error) {
    console.error('Mindmaps DELETE /:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
export default router;
