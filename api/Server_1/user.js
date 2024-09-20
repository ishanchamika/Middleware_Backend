const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
const {INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE} = require('../../models/Server_1_DB');
const {SendMail} = require('../../include/NodemailerConfig');
const {generateOtp} = require('../../include/OtpGen');
const e = require('express');
const bcrypt = require('bcrypt');
const {error} = require('console');


router.post('/signinuser', (req, res) => 
{
	const email = req.body.email;
	const password = req.body.password;
	console.log(email);
	(async () => 
	{
		try {
			await SELECT_WHERE('user', 'email', email).then((response) => 
			{
				if (response.length > 0) 
				{
					bcrypt.compare(password, response[0].password, async (err, result_2) => 
					{
						if (result_2) 
						{
							if (response[0].state != 'verified') 
							{
								const otp = generateOtp(6);
								QUERY("UPDATE user SET state='" + otp + "' WHERE email='" + email + "'").then((result_3) => 
								{
									SendMail(otp, email).then((response) => 
									{
										res.send({type: 'warning', message: 'Need to verify email first'});
									});
								});
							} 
							else 
							{
								res.send({type: 'success', user: response[0].type, id: response[0].user_id});
							}
						} 
						else 
						{
							res.send({type: 'error', message: 'Incorrect password'});
						}
					});
				} 
				else 
				{
					res.send({type: 'error', message: 'Incorrect email address'});
				}
			});
		} 
		catch (error) 
		{
			res.send('success');
			console.error('Error executing query:', error);
		}
	})();
});

router.post('/registeruser', (req, res) => 
{
	const email = req.body.email;
	const password = req.body.password;

	bcrypt.hash(password, 10, (err, hash) => 
	{
		if (err) 
		{
			res.send({type: 'errorN', message: 'An error occured. Try again later'});
		} 
		else 
		{
			QUERY("SELECT * FROM user WHERE email='" + email + "'").then((result) => 
			{
				console.log(result);
				if (result.length == 0) 
				{
					const otp = generateOtp(6);
					QUERY("INSERT INTO user(email,password,state) VALUES('" + email + "','" + hash + "','" + otp + "')").then((result_1) => 
					{
						SendMail(otp,password,email).then((response) => 
						{
							res.send({type: 'success', message: 'Account created successfully'});
						});
					});
				}
				else 
				{
					res.send({type: 'error', message: 'Account already exists!'});
				}
			});
		}
	});
});

router.post('/addcustomer', (req, res) => 
{
	const email = req.body.email;
	const name = req.body.name;
	const contact_no = req.body.contact_no;
	const password = req.body.password;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) 
		{
			res.send({type: 'error', message: 'An error occured. Try again later'});
		} 
		else 
		{
			QUERY("SELECT * FROM user WHERE email='" + email + "'").then((result) => 
			{
				console.log(result);
				if (result.length == 0) 
				{
					QUERY(
                        "INSERT INTO user(name,contact_no,email,password,state) VALUES('" +
                            name +
                            "','" +
                            contact_no +
                            "','" +
                            email +
                            "','" +
                            hash +
                            "','" +
                            "verified" +
                            "')"
                    ).then((result_1) => {
                        SendMail(0, password, email).then((response) => 
						{
                            res.send({
                                type: "success",
                                message: "Account created successfully",
                            });
                        });
                    });
				} else {
					res.send({type: 'error', message: 'Account already exists!'});
				}
			});
		}
	});
});


router.post('/verifyuser', (req, res) => 
{
	const email = req.body.email;
	const otp = req.body.otp;
	SELECT_WHERE('user', 'email', email).then((response) => 
	{
		if (response[0].state != 'verified' && response[0].state != 'notverified') 
		{
			if (response[0].state == otp) 
			{
				QUERY("UPDATE user SET state='verified' WHERE email='" + email + "'").then((response) => 
				{
					res.send({type: 'success', message: 'Account verified successfully'});
				});
			} 
			else 
			{
				res.send({type: 'error', message: 'Invalid OTP'});
			}
		} 
		else 
		{
			res.send({type: 'error', message: 'An error occured'});
		}
	});
});

router.get('/customers', (req, res) => 
{
	QUERY("SELECT * FROM user WHERE type = 'Customer';").then((response) => 
	{
		res.send(response);
	});
});

router.get('/getallstaff', (req, res) => 
{
	QUERY('SELECT * FROM `user` WHERE type="Staff"').then((response) => 
	{
		res.send(response);
	});
});


router.post('/addstaff', async (req,res)=>
{
    const name =req.body.name
	const email =req.body.email
	const type = req.body.type
	const contact_no = req.body.contactNo
    const password = "Sritel@123"

	bcrypt.hash(password, 10, (err, hash) => 
	{
		if (err) 
		{
			res.send({type: 'error', message: 'An error occured. Try again later'});
		} 
		else 
		{
			QUERY("SELECT * FROM user WHERE email='" + email + "'").then((result) => {
				console.log(result);
				if (result.length == 0) 
				{
					QUERY(
                        "INSERT INTO user(name,contact_no,email,password,state,type) VALUES('" +
                            name +
                            "','" +
                            contact_no +
                            "','" +
                            email +
                            "','" +
                            hash +
                            "','" +
                            "verified" +
                            "','" +
                            type +
                            "')"
                    ).then((result_1) => {
                        SendMail(0, password, email).then((response) => {
							res.send({
                                type: "success",
                                message: "Account created successfully",
                            });
                        });
                    });
				} 
				else 
				{
					res.send({type: 'error', message: 'Account already exists!'});
				}
			});
		}
	});
})


module.exports = router;
