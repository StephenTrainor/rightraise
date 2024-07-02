const brevo = require("@getbrevo/brevo");

export default async function handler(req, res) {
    const { body: { emailAddress, projectID, projectDescription, invitorName } } = req.body;
    
    const subject = `${invitorName} invited you to a fundraising campaign!`;
    const donorLink = `${process.env.BASE_URL}/donate/${projectID}`;

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    let apiInstance = new brevo.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications['apiKey'];

    apiKey.apiKey = process.env.BREVO_API_KEY;

    sendSmtpEmail = {
        subject: subject,
        sender: {
            "name": "Right Raise",
            "email": "stephontrainor@gmail.com",
        },
        to: [{
            "name": "Right Raise Donor",
            "email": emailAddress,
        }],
        templateId: 2,
        params: {
            invitorName: invitorName,
            projectDescription: projectDescription,
            donorLink: donorLink,
        },
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.json(response);
}
