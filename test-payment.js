const https = require('https');
const PaytmChecksum = require('paytmchecksum');

const paytmConfig = {
  MID: "DIY12386817555501617",
  KEY: "bKMfNxPPf_QdZppa",
  WEBSITE: "WEBSTAGING",
  CHANNEL_ID: "WEB",
  INDUSTRY_TYPE: "Retail"
};

async function testPaytm() {
  try {
    const orderId = "TEST_ORDER_" + Date.now();
    const amount = "10.00";
    
    const requestBody = {
      body: {
        requestType: "Payment",
        mid: paytmConfig.MID,
        websiteName: paytmConfig.WEBSITE,
        orderId: orderId,
        callbackUrl: "http://localhost:5000/api/payments/paytm/callback",
        txnAmount: {
          value: amount,
          currency: "INR"
        },
        userInfo: {
          custId: "TEST_CUST_123"
        }
      }
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(requestBody.body),
      paytmConfig.KEY
    );

    requestBody.head = {
      signature: checksum
    };

    console.log("Checksum:", checksum);
    console.log("Full request:", JSON.stringify(requestBody, null, 2));

    const options = {
      hostname: "securegw-stage.paytm.in",
      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${paytmConfig.MID}&orderId=${orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
        console.log('Received chunk:', chunk.toString());
      });
      
      res.on('end', () => {
        console.log("Complete Response:", data);
        try {
          const parsed = JSON.parse(data);
          console.log("Parsed response:", JSON.stringify(parsed, null, 2));
          
          if (parsed.body && parsed.body.txnToken) {
            console.log("SUCCESS: Got txnToken:", parsed.body.txnToken);
          } else {
            console.log("ERROR: No txnToken in response");
            console.log("Error details:", parsed.body?.resultInfo);
          }
        } catch (e) {
          console.error("Parse error:", e);
          console.log("Raw data that failed to parse:", data);
        }
      });
    });

    req.on('error', (e) => {
      console.error("Request error:", e);
    });

    req.write(JSON.stringify(requestBody));
    req.end();

  } catch (error) {
    console.error("Test error:", error);
  }
}

testPaytm();