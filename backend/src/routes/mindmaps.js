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
    console.log('Mindmaps GET / - user:', uid);
    let snapshot;
    try {
      snapshot = await db
        .collection('mindmaps')
        .where('userId', '==', uid)
        .orderBy('updatedAt', 'desc')
        .get();
    } catch (queryErr) {
      console.warn('Mindmaps GET: orderBy query failed, falling back to unordered query:', queryErr.message);
      // Fallback: fetch without orderBy (avoids requiring a composite index), we'll sort in JS
      snapshot = await db.collection('mindmaps').where('userId', '==', uid).get();
    }

    const maps = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        title: data.title,
        createdAt: tsToISO(data.createdAt),
        updatedAt: tsToISO(data.updatedAt),
      };
    });

    // If we fell back (no orderBy), ensure maps are sorted by updatedAt desc
    maps.sort((a, b) => {
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tb - ta;
    });

    res.json(maps);
  } catch (error) {
    console.error('Mindmaps GET / error:', error);
    const msg = error && error.message ? error.message : 'Server error';
    res.status(500).json({ message: msg });
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
    const msg = error && error.message ? error.message : 'Server error';
    res.status(500).json({ message: msg });
  }
});

// Create a new mind map
router.post('/', auth, async (req, res) => {
  try {
    const { title, nodes } = req.body;
    console.log('POST /api/mindmaps body:', { title, nodesLength: Array.isArray(nodes) ? nodes.length : null });
    console.log('Authenticated user:', req.user);
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
    const msg = error && error.message ? error.message : 'Server error';
    res.status(500).json({ message: msg });
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

    const updatePayload = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
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
    const msg = error && error.message ? error.message : 'Server error';
    res.status(500).json({ message: msg });
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
    const msg = error && error.message ? error.message : 'Server error';
    res.status(500).json({ message: msg });
  }
});

export default router;
