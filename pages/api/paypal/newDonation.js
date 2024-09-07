import { db } from '../../../firebase';
import { updateDoc, doc } from 'firebase/firestore';

export default async function handler(req, res) {
    const { body: { name, amount, message, projectData, projectID } } = req.body;

    if (!name || !amount || !message || !projectData || !projectID) {
        res.json({"status": 400, "errorMessage": "Incomplete API request", "bodyReceived": req.body});
        return;
    }

    projectData.donations.push({
        amount: amount,
        message: message,
        name: name,
        hide: false,
    });

    const projectRef = doc(db, "projects", projectID);

    await updateDoc(projectRef, {
        donations: projectData.donations,
    });

    res.json(projectData.donations);
};
