// In-memory store for survivors and leaderboard (in production, use a database)
let survivors = new Map();
let leaderboard = [];
let survivorIdCounter = 1;

// Calculate score based on survivor stats
function calculateScore(survivor) {
  return (
    survivor.health * 2 +
    survivor.hunger * 1.5 +
    survivor.morale * 2 +
    survivor.shelter * 2.5 +
    survivor.allies * 5 +
    survivor.day * 10
  );
}

// Create new survivor
export const createSurvivor = (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const survivorId = survivorIdCounter++;
    const newSurvivor = {
      id: survivorId,
      name: name.trim(),
      health: 100,
      hunger: 100,
      morale: 100,
      shelter: 50,
      allies: 0,
      day: 1,
      score: 0,
      status: 'alive',
      createdAt: new Date(),
      decisions: []
    };

    newSurvivor.score = calculateScore(newSurvivor);
    survivors.set(survivorId, newSurvivor);

    res.json({ survivor: newSurvivor });
  } catch (error) {
    console.error('Error creating survivor:', error);
    res.status(500).json({ error: 'Failed to create survivor' });
  }
};

// Make a decision
export const makeDecision = (req, res) => {
  try {
    const { survivorId } = req.params;
    const { decision } = req.body;

    const survivor = survivors.get(parseInt(survivorId));
    if (!survivor) {
      return res.status(404).json({ error: 'Survivor not found' });
    }

    if (survivor.status !== 'alive') {
      return res.status(400).json({ error: 'Game is over' });
    }

    let message = '';
    let scoreGain = 0;
    let zombieEvent = false;

    // Process decision
    switch (decision) {
      case 'shelter':
        if (survivor.hunger >= 15) {
          survivor.shelter = Math.min(100, survivor.shelter + 30);
          survivor.hunger = Math.max(0, survivor.hunger - 15);
          message = 'Built a sturdy shelter! Safety increased.';
          scoreGain = 50;
        } else {
          survivor.health = Math.max(0, survivor.health - 10);
          message = 'Too hungry to build shelter effectively. Health decreased.';
          scoreGain = -20;
        }
        break;

      case 'food':
        const foodSuccess = Math.random() > 0.4; // 60% success rate
        if (foodSuccess) {
          survivor.hunger = Math.min(100, survivor.hunger + 40);
          survivor.health = Math.min(100, survivor.health + 10);
          message = 'Successfully hunted food!';
          scoreGain = 60;
        } else {
          survivor.health = Math.max(0, survivor.health - 20);
          message = 'Hunting went wrong! Encountered danger.';
          scoreGain = -30;
          zombieEvent = true;
        }
        break;

      case 'allies':
        const alliesSuccess = Math.random() > 0.5; // 50% success rate
        if (alliesSuccess) {
          survivor.allies = Math.min(5, survivor.allies + 1);
          survivor.morale = Math.min(100, survivor.morale + 25);
          message = 'Found friendly survivors!';
          scoreGain = 40;
        } else {
          survivor.morale = Math.max(0, survivor.morale - 15);
          message = 'Search for allies was unsuccessful.';
          scoreGain = -20;
        }
        break;

      case 'rest':
        survivor.health = Math.min(100, survivor.health + 20);
        survivor.morale = Math.min(100, survivor.morale + 10);
        survivor.hunger = Math.max(0, survivor.hunger - 5);
        message = 'Rest restored your health and morale.';
        scoreGain = 35;
        break;

      default:
        return res.status(400).json({ error: 'Invalid decision' });
    }

    // Daily decay
    survivor.hunger = Math.max(0, survivor.hunger - 10);
    survivor.morale = Math.max(0, survivor.morale - 5);

    // Random events
    const randomEvent = Math.random();
    if (randomEvent < 0.2) {
      // Zombie attack
      survivor.health = Math.max(0, survivor.health - 25);
      message += ' A zombie horde appeared!';
      zombieEvent = true;
      scoreGain -= 40;
    } else if (randomEvent < 0.3) {
      // Found supplies
      survivor.hunger = Math.min(100, survivor.hunger + 15);
      message += ' Found some supplies!';
      scoreGain += 20;
    }

    // Check win/loss conditions
    survivor.day++;
    
    if (survivor.health <= 0) {
      survivor.status = 'dead';
      message = `You died on day ${survivor.day - 1}!`;
    } else if (survivor.day > 14) {
      survivor.status = 'escaped';
      message = 'You survived and escaped!';
      scoreGain += 200;
    }

    survivor.score = calculateScore(survivor);
    survivors.set(parseInt(survivorId), survivor);

    res.json({
      survivor,
      message,
      scoreGain,
      zombieEvent
    });
  } catch (error) {
    console.error('Error making decision:', error);
    res.status(500).json({ error: 'Failed to make decision' });
  }
};

// Get leaderboard
export const getLeaderboard = (req, res) => {
  try {
    const sortedLeaderboard = [...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json({
      leaderboard: sortedLeaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

// Add to leaderboard
export const addToLeaderboard = (req, res) => {
  try {
    const { name, score, days, survived } = req.body;

    if (!name || typeof score !== 'number' || typeof days !== 'number') {
      return res.status(400).json({ error: 'Invalid leaderboard entry' });
    }

    const entry = {
      id: leaderboard.length + 1,
      name: name.trim(),
      score,
      days,
      survived: survived === true,
      timestamp: new Date()
    };

    leaderboard.push(entry);

    // Keep only top 100
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100);

    res.json({ entry });
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    res.status(500).json({ error: 'Failed to add to leaderboard' });
  }
};

// Get survivor details
export const getSurvivor = (req, res) => {
  try {
    const { survivorId } = req.params;
    const survivor = survivors.get(parseInt(survivorId));

    if (!survivor) {
      return res.status(404).json({ error: 'Survivor not found' });
    }

    res.json({ survivor });
  } catch (error) {
    console.error('Error getting survivor:', error);
    res.status(500).json({ error: 'Failed to get survivor' });
  }
};
