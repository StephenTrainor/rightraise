const axios = require("axios");

export async function domainStatus(emailAddress) {
    try {
        const validDomainResponse = await axios.get(`https://api.mailcheck.ai/email/${emailAddress}`);

        return validDomainResponse.data.status;
    } catch (e) {
        return 429;
    }
};

export async function sendEmailInvitation(emailAddress, projectID, projectDescription, invitorName) {
    const response = await axios.post("../api/brevo/emails", {
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            emailAddress: emailAddress,
            projectID: projectID,
            projectDescription: projectDescription,
            invitorName: invitorName
        },
    });
};
