import { db } from "../firebase";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";

export async function getProjectIDs() {
    const projectsSnapshot = await getDocs(collection(db, "projects"));

    const projectIDs = [];

    projectsSnapshot.forEach((doc) => {
        projectIDs.push({
            params: {
                id: doc.id
            }
        });
    });

    return projectIDs;
}

export async function getProjectData(id) {
    const projectSnapshot = await getDoc(doc(db, "projects", id));

    if (projectSnapshot.exists()) {
        return {
            id,
            ...projectSnapshot.data()
        };
    }
}
