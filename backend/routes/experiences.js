const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

// create experience (host only)
router.post('/', auth, async (req,res) => {
  if (req.user.role === 'user') return res.status(403).json({ message: 'Not a host' });
  const data = req.body;
  data.host = req.user._id;
  const exp = await Experience.create(data);
  res.json(exp);
});

// list experiences (with optional geo filter)
router.get('/', async (req,res) => {
  const { lng, lat, radiusKm, q } = req.query;
  let filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (lng && lat) {
    filter.location = {
      $geoWithin: {
        $centerSphere: [[parseFloat(lng), parseFloat(lat)], (parseFloat(radiusKm || 10) / 6378.1)]
      }
    };
  }
  const list = await Experience.find(filter).limit(50).populate('host','name avatarUrl verifiedHost');
  res.json(list);
});

// get single
router.get('/:id', async (req,res) => {
  const e = await Experience.findById(req.params.id).populate('host','name bio avatarUrl verifiedHost');
  res.json(e);
});

module.exports = router;
