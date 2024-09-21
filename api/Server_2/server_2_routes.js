const {INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE} = require('../../models/Server_2_DB');
const express = require('express');
const router = express.Router();

// Add package route with try-catch
router.post('/addpackage', async (req, res) => {
    try {
        const PK_name = req.body.name;
        const PK_des = req.body.description;
        const PK_data = req.body.data;  // Changed from req.query to req.body
        const PK_voice = req.body.voice;
        const PK_sms = req.body.sms;
        const PK_price = req.body.price;
        const PK_type = req.body.type;

        console.log('Data received:', { PK_name, PK_des, PK_data, PK_voice, PK_sms, PK_price, PK_type });

        const response = await QUERY(
            `INSERT INTO package(name, description, type, data_limit, voice_limit, sms_limit, price) 
            VALUES('${PK_name}', '${PK_des}', '${PK_type}', ${parseFloat(PK_data)}, 
            ${parseInt(PK_voice)}, ${parseInt(PK_sms)}, ${parseInt(PK_price)})`
        );
        
        console.log('Query response:', response);
        res.send('success');
    } catch (error) {
        console.error('Error inserting package:', error);
        res.status(500).send('Error adding package');
    }
});


// Get all packages route with try-catch
router.get('/getallpackages', async (req, res) => {
    try {
        const response = await QUERY('SELECT * FROM package');
        res.send(response);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).send('Error fetching packages');
    }
});

// Activate package route with try-catch
router.post('/activatepackage', async (req, res) => {
    try {
        let { user, id } = req.body;

        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setDate(futureDate.getDate() + 30);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const year_2 = futureDate.getFullYear();
        const month_2 = String(futureDate.getMonth() + 1).padStart(2, '0');
        const day_2 = String(futureDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const formattedDate_2 = `${year_2}-${month_2}-${day_2}`;

        const response = await QUERY(
            `INSERT INTO user_package(package_id, user_id, activated_date, expiration_date) 
            VALUES('${id}', '${user}', '${formattedDate}', '${formattedDate_2}')`
        );
        
        res.send('success');
    } catch (error) {
        console.error('Error activating package:', error);
        res.status(500).send('Error activating package');
    }
});

module.exports = router;
