const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// create a booking -> create stripe session
router.post('/create-checkout-session', auth, async (req,res) => {
  const { experienceId, date, guests } = req.body;
  const exp = await Experience.findById(experienceId).populate('host');
  if (!exp) return res.status(404).json({ message: 'Experience not found' });

  const unitPrice = exp.price; // assume in cents
  const total = unitPrice * (guests || 1);

  // create Booking pending
  const booking = await Booking.create({
    experience: exp._id,
    user: req.user._id,
    host: exp.host._id,
    totalPrice: total,
    date: new Date(date),
    status: 'pending'
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: exp.title },
        unit_amount: total
      },
      quantity: 1
    }],
    success_url: `${process.env.CLIENT_URL}/booking-success?bookingId=${booking._id}`,
    cancel_url: `${process.env.CLIENT_URL}/booking-cancel?bookingId=${booking._id}`,
    metadata: { bookingId: booking._id.toString() }
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  res.json({ url: session.url });
});

// webhook to capture payment intent (simplified — production needs signature verification)
router.post('/webhook', express.raw({type: 'application/json'}), async (req,res) => {
  let event = req.body;
  // In prod: verify stripe signature with stripe.webhooks.constructEvent
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.status = 'paid';
      await booking.save();
      // TODO: transfer to host via Stripe Connect in production
    }
  }
  res.json({ received: true });
});

module.exports = router;
