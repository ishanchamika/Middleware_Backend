const {INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE} = require('../../models/Server_4_DB');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51O934qEl5EhYFgAyD66NQJFZB1ylROUeSjdLugkk7wk6wUfyBp8ZxVZs3ZvcHHSCEG52rUFHqEMAl3rlkq4xiDjP00ZJsS81kX');
router.post('/payment',  (req, res) => {
	//console.log('payment');
	let {amount, id} = req.body;
	try {
		const paymentIntent = stripe.paymentIntents.create({
			amount: amount,
			currency: 'lkr',
			payment_method: id,
			confirm: true,
		});
		if (paymentIntent) {
			res.send('success');
		} else {
			res.send('unsuccessful');
		}
		//console.log(paymentIntent);

		//res.json({message: 'success'});
	} catch (e) {
		res.send('error');
	}
});

module.exports = router;
