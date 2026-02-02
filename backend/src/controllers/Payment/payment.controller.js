const midtransClient = require('midtrans-client');
const config = require('../../config/config');

// Create Core API instance
let snap = new midtransClient.Snap({
    isProduction: config.midtrans.isProduction,
    serverKey: config.midtrans.serverKey,
    clientKey: config.midtrans.clientKey
});

exports.createTransaction = async (req, res) => {
    try {
        const { orderId, amount, items, customerDetails } = req.body;

        if (!orderId || !amount) {
            return res.status(400).json({ message: 'Order ID and Amount are required' });
        }

        let parameter = {
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": amount
            },
            "credit_card": {
                "secure": true
            },
            "customer_details": customerDetails,
            "item_details": items,
            "enabled_payments": ["bca_va", "bni_va", "bri_va", "echannel", "permata_va", "other_va"]
        };

        const transaction = await snap.createTransaction(parameter);

        res.status(200).json({
            token: transaction.token,
            redirect_url: transaction.redirect_url
        });
    } catch (error) {
        console.error('Midtrans Error:', error);
        res.status(500).json({ message: 'Payment gateway error', error: error.message });
    }
};

exports.handleNotification = async (req, res) => {
    try {
        let apiClient = new midtransClient.Snap({
            isProduction: config.midtrans.isProduction,
            serverKey: config.midtrans.serverKey,
            clientKey: config.midtrans.clientKey
        });

        // Verification logic would go here
        // const statusResponse = await apiClient.transaction.notification(req.body);

        console.log('Payment Handling Notification:', req.body);

        res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('Notification Error:', error);
        res.status(500).json({ message: 'Error handling notification' });
    }
};
