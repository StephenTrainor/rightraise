import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { db } from '../firebase';
import { limit, query, where, getDocs, addDoc, collection } from 'firebase/firestore';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DollarInput from '../components/DollarInput';
import TextInput from '../components/textInput';
import Layout from "../components/layout";
import Navbar from "../components/Navbar";

const whiteTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFFFFF',
        },
    },
});

export default function Create() {
    const router = useRouter();
    const { data: session } = useSession();
    const [formError, setFormError] = useState(false);
    const [readyForNewProject, setReadyForNewProject] = useState(0);
    const [userInput, setUserInput] = useState({
        "Name": '',
        "Description": '',
        "Goal": 0,
    });
    const [inputErrors, setInputErrors] = useState({
        "Name": false,
        "Description": false,
        "Goal": false,
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
            });

            router.push(`/projects/${docRef.id}`);
        };

        if (!readyForNewProject) return;
        createNewProject();
    }, [readyForNewProject]);

    return (
        <Layout title="Create">
            <Navbar title="Create"/>

            { (session) ?
                <ThemeProvider theme={whiteTheme}>
                    <div class="mt-12 md:mt-8 w-56 sm:w-80 md:w-96 flex flex-col items-center mx-auto space-y-4">
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
                        { (formError) ? 
                            (
                                <Alert severity='error'>All Fields Must Be Completed</Alert>
                            ) : (
                                <></>
                            )
                        }
                        <Button variant="outlined" onClick={() => {verifyUserInput()}}>Create</Button>
                    </div>
                </ThemeProvider>
                :
                <div class="text-3xl text-center align-middle">
                    <p class="m-4">Create a fundraiser or project once signed in</p>
                    <p class="mt-8"><button onClick={() => signIn('google')} class="font-bold underline">Sign In</button> to get started</p>
                </div>
            }
        </Layout>
    )
};