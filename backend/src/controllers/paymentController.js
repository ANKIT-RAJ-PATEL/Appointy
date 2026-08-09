// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// // @desc    Create Payment Intent
// // @route   POST /api/payments/create-intent
// // @access  Private
// const createPaymentIntent = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         // Create a PaymentIntent with the order amount and currency
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100, // Convert to cents
//             currency: 'usd',
//             automatic_payment_methods: {
//                 enabled: true,
//             },
//         });
//         res.json({
//             clientSecret: paymentIntent.client_secret,
//         });
//     } catch (error) {
//         console.error("Stripe Error:", error);
//         res.status(500).json({ message: error.message || 'Payment initiation failed' });
//     }
// };
// module.exports = { createPaymentIntent };


const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                message: 'Invalid payment amount'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(numericAmount * 100),
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log("🔥 PaymentIntent created:", paymentIntent.id);
        console.log("🔥 Client secret exists:", !!paymentIntent.client_secret);

        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error("Stripe Error:", error);

        res.status(500).json({
            message: error.message || 'Payment initiation failed'
        });
    }
};

module.exports = { createPaymentIntent };