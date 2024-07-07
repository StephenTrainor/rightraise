import { Alert, Button, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { db } from '../firebase';
import { limit, query, where, getDocs, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useSession, signIn } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DollarInput from '../components/DollarInput';
import TextInput from '../components/TextInputFix';
import Layout from "../components/layout";
import Navbar from "../components/Navbar";

export default function Create() {
    const router = useRouter();
    const { data: session } = useSession();
    const [userProfile, setUserProfile] = useState(null);
    const [formError, setFormError] = useState(false);
    const [readyForNewProject, setReadyForNewProject] = useState(0);
    const [userInput, setUserInput] = useState({
        "Name": '',
        "Description": '',
        "Goal": 0,
        "PayPal Business Client ID": '',
    });
    const [inputErrors, setInputErrors] = useState({
        "Name": false,
        "Description": false,
        "Goal": false,
        "PayPal Business Client ID": false,
    });

    const updateUserInput = (e) => {
        setUserInput({
            ...userInput,
            [e.target.id]: e.target.value
        });
    };

    const verifyUserInput = () => {
        var errorFound = false;
        var tempErrors = inputErrors;

        for (const [key, value] of Object.entries(userInput)) {
            if ((typeof value === 'string' && value === '') || value <= 0 || typeof value === 'undefined') {
                errorFound = true;
                setFormError(true);
                tempErrors[key] = true;
            }
        }

        setInputErrors({
            ...tempErrors
        });

        if (!errorFound) {
            setFormError(false);
            setReadyForNewProject(readyForNewProject + 1);
        }
    };

    const getUserProfile = async (userEmailAddress) => {
        const usersQuery = query(collection(db, "users"), where("emailAddress", "==", userEmailAddress));
        const usersQuerySnapshot = await getDocs(usersQuery);
    
        usersQuerySnapshot.forEach((doc) => {
            setUserProfile({
                ...doc.data(),
            });
        });
    }

    useEffect(() => {
        const getUserID = async () => {
            var id = "";

            const userEmail = session.user.email;

            const userQuery = query(collection(db, "users"), where("emailAddress", "==", userEmail), limit(1));
            const userRef = await getDocs(userQuery);

            userRef.forEach((doc) => {
                id = doc.id;
            });

            return id;
        };

        const createNewProject = async () => {
            const userID = await getUserID();
        
            const docRef = await addDoc(collection(db, "projects"), {
                description: userInput["Description"],
                donations: [],
                emailsByID: {},
                goal: userInput["Goal"],
                name: userInput["Name"],
                phoneNumbersByID: {},
                projectOwnerID: userID,
                projectParticipantIDs: [],
                paypalID: userInput["PayPal Business Client ID"]
            });

            const userReference = doc(db, "users", userID);
            updateDoc(userReference, {
                projectsOwned: [...userProfile.projectsOwned, docRef.id],
            });

            router.push(`/projects/${docRef.id}`);
        };

        if (!readyForNewProject) return;
        createNewProject();
    }, [readyForNewProject]);

    useEffect(() => {
        if (!session) return;

        getUserProfile(session.user.email);
    }, [session]);

    return (
        <Layout title="Create">
            <Navbar title="Create"/>

            { (session) ?
                <div className="mt-12 md:mt-8 w-56 sm:w-80 md:w-96 flex flex-col items-center mx-auto space-y-4">
                    <TextInput 
                        id="Name"
                        userInput={userInput}
                        update={updateUserInput}
                        inputErrors={inputErrors}
                        setInputErrors={setInputErrors}
                    />
                    <TextInput 
                        id="Description"
                        userInput={userInput}
                        update={updateUserInput}
                        inputErrors={inputErrors}
                        setInputErrors={setInputErrors}
                        multiline
                    />
                    <DollarInput 
                        id="Goal"
                        userInput={userInput}
                        inputErrors={inputErrors}
                        setUserInput={setUserInput}
                        setInputErrors={setInputErrors}
                    />
                    <TextInput 
                        id="PayPal Business Client ID"
                        userInput={userInput}
                        update={updateUserInput}
                        inputErrors={inputErrors}
                        setInputErrors={setInputErrors}
                    />
                    { (formError) ? 
                        (
                            <Alert severity='error'>All Fields Must Be Completed</Alert>
                        ) : (
                            <></>
                        )
                    }
                    <Button variant="outlined" onClick={() => {verifyUserInput()}}>Create</Button>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDownwardIcon />}
                        >
                            What is my PayPal Business Client ID?
                        </AccordionSummary>
                        <AccordionDetails>
                            Your PayPal Business Client ID is a unique identifier and point of access for RightRaise to directly move funds into your PayPal Account. From there, funds can be withdrawn and used in programs that matter.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDownwardIcon />}
                        >
                            How do I get a PayPal Business Client ID?
                        </AccordionSummary>
                        <AccordionDetails>
                            1. With your school or organization, create a business PayPal account
                            <br />
                            <br />
                            2. Visit <Link className="underline" href="https://developer.paypal.com/dashboard/applications">PayPal's developer tools</Link>
                            <br />
                            <br />
                            3. Click "Create App" and fill out the details
                            <br />
                            <br />
                            4. The Client ID is your PayPal Business Client ID, DO NOT share your Secret Key with anyone or RightRaise
                        </AccordionDetails>
                    </Accordion>
                </div>
                :
                <div class="text-3xl text-center align-middle">
                    <p class="m-4">Create a fundraiser or project once signed in</p>
                    <p class="mt-8"><button onClick={() => signIn('google')} class="font-bold underline">Sign In</button> to get started</p>
                </div>
            }
        </Layout>
    )
};
