import QRCode from "qrcode";
import Layout from "../../components/layout";
import Navbar from "../../components/Navbar";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { db } from '../../firebase';
import { collection, updateDoc, getDocs, where, query, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { getProjectIDs, getProjectData } from "../../lib/projects";
import { domainStatus, sendEmailInvitation } from "../../lib/apiUtils";
import utilStyles from "../../styles/utils.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import LineWithAnnotationsChart from "../../components/LineWithAnnotationsChart";
import RadialBarChart from "../../components/RadialBarChart";

const updateEmailsByID = async (userID, projectID, project) => {
    const projectRef = doc(db, "projects", projectID);

    await updateDoc(projectRef, {
        ['emailsByID.' + userID]: project.emailsByID[userID]
    });
};

const updatePhoneNumbersByID = async (userID, projectID, project) => {
    const projectRef = doc(db, "projects", projectID);

    await updateDoc(projectRef, {
        ['phoneNumbersByID.' + userID]: project.phoneNumbersByID[userID]
    });
};

export default function Project({projectData, projectID}) {
    const router = useRouter();
    const { data: session } = useSession();
    const [userID, setUserID] = useState();

    const project = projectData;
    const [url, setUrl] = useState(`${process.env.BASE_URL}/projects/${projectID}`);
    const [emailsSent, setEmailsSent] = useState(0);
    const [phoneNumbersSent, setPhoneNumbersSent] = useState(0);
    const [QRCodeDataUrl, setQRCodeDataUrl] = useState("");

    useEffect(() => {
        if (session) {
            const getUserID = async (emailAddress) => {
                const usersQuery = query(collection(db, "users"), where("emailAddress", "==", emailAddress));
                const usersQuerySnapshot = await getDocs(usersQuery);

                var tempUserID = "";

                usersQuerySnapshot.forEach((doc) => {
                    tempUserID = doc.id;
                    setUserID(doc.id);
                });


                if (!project.emailsByID[tempUserID]) {
                    project.emailsByID[tempUserID] = [];
                }
                else {
                    setEmailsSent(project.emailsByID[tempUserID].length);
                }

                if (!project.phoneNumbersByID[tempUserID]) {
                    project.phoneNumbersByID[tempUserID] = [];
                }
                else {
                    setPhoneNumbersSent(project.phoneNumbersByID[tempUserID].length);
                }
            };

            getUserID(session.user.email);
        }
    }, [session]);

    useEffect(() => {
        const getQRCodeDataUrl = async () => {
            try {
                const qrCodeData = await QRCode.toDataURL(url);
                setQRCodeDataUrl(qrCodeData);
            } catch (err) {
                console.error(err);
            }
        };

        getQRCodeDataUrl();
    }, []);

    const [input, setInput] = useState({
        "Email": "",
        "PhoneNumber": ""
    });
    const [inputErrors, setInputErrors] = useState({
        "Email": false,
        "PhoneNumber": false
    });
    const [errorText, setErrorText] = useState({
        "Email": "",
        "PhoneNumber": ""
    });

    const updateInput = (e) => {
        if (!e.target.value) {
            setInputErrors({
                ...inputErrors,
                [e.target.id]: true,
            });
        }
        else {
            setInputErrors({
                ...inputErrors,
                [e.target.id]: false,
            });
        }

        setInput({
            ...input,
            [e.target.id]: e.target.value
        });
    };

    const validateEmail = async () => {
        const email = input["Email"];
        const status = await domainStatus(email);

        if (status === 200) {
            if (project.emailsByID[userID].indexOf(email) != -1) {
                setErrorText({
                    ...errorText,
                    "Email": "Duplicate Email"
                });
            }
            else {
                setErrorText({
                    ...errorText,
                    "Email": ""
                });
                setInputErrors({
                    ...inputErrors,
                    "Email": false
                });
                setInput({
                    ...input,
                    "Email": ""
                });
                setEmailsSent(emailsSent + 1);

                project.emailsByID[userID].push(email);

                await sendEmailInvitation(email, projectID, project.description, session.user.name);
                await updateEmailsByID(userID, projectID, project);

                return;
            }
        }
        else if (status === 429) { 
            setErrorText({
                ...errorText,
                "Email": "Try again later"
            });
        }
        setInputErrors({
            ...inputErrors,
            "Email": true
        });
    };

    const validatePhoneNumber = async () => {
        const phoneNumber = input["PhoneNumber"];

        if (project.phoneNumbersByID[userID].indexOf(phoneNumber) != -1) {
            setErrorText({
                ...errorText,
                "PhoneNumber": "Duplicate Phone Number"
            });
        }
        else if (phoneNumber.length === 10) {
            setErrorText({
                ...errorText,
                "PhoneNumber": ""
            });
            setInputErrors({
                ...inputErrors,
                "PhoneNumber": false
            });
            setInput({
                ...input,
                "PhoneNumber": ""
            });
            setPhoneNumbersSent(phoneNumbersSent + 1);

            project.phoneNumbersByID[userID].push(phoneNumber);

            // Buy more SMS credits for Brevo then implement

            await updatePhoneNumbersByID(userID, projectID, project);

            return;
        }
        else {
            setErrorText({
                ...errorText,
                "PhoneNumber": "Invalid Number"
            });
        }
        setInputErrors({
            ...inputErrors,
            "PhoneNumber": true
        });
    };
    
    const copyQRCodeToClipboard = async () => {
        try {
            const response = await fetch(QRCodeDataUrl);
            const blob = await response.blob();
            const item = new ClipboardItem({ 'image/png': blob});

            await navigator.clipboard.write([item]);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Layout title={project.name}>
            <Navbar title="Project Overview"/>
            {
                (!session) ?
                    <>
                        <div class="text-3xl text-center align-middle">
                            <p class="m-4">Users must be logged in to view projects</p>
                            <p class="mt-8"><button onClick={() => signIn('google')} class="font-bold underline">Sign In</button> to get started or <button class="font-bold underline" onClick={() => router.push(`/donate/${projectID}`)}>Donate Now</button></p>
                        </div>

                        <div className={utilStyles.container}>
                            <div className={utilStyles.cube}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </>
                :
                    <div className="flex flex-col justify-center">
                        <div className="round-border responsive-col grid">
                            <b><p className="centered">{project.name}</p></b>
                            <p>{project.description}</p>

                            <LineWithAnnotationsChart donations={project.donations} goal={project.goal} />
                        </div>
                        <Link href={`/donate/${projectID}`} className="mx-auto">
                            <div className="light-bg hover:hover-bg button-container2">
                                Donate Now!
                            </div>
                        </Link>
                        <div className="p-4 m-6 mt-8 mb-8 m-auto responsive-col flex md:flex-row flex-col justify-center">
                            <div className="bar-chart-container mb-32 md:mb-0">
                                <RadialBarChart name="Emails Sent" progress={emailsSent} goal={25} />
                                <p className="mt-5 mb-3 mx-auto text-sm">Add Email Addresses</p>
                                <div className="input-container">
                                    <TextField 
                                        required
                                        error={inputErrors["Email"]}
                                        label="Email"
                                        helperText={(inputErrors["Email"]) ? (errorText["Email"] || "Invalid Email") : ""}
                                        variant="outlined" 
                                        id="Email" 
                                        value={input["Email"]} 
                                        onChange={(e) => updateInput(e)} 
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="button-container">
                                    <Button
                                        sx={{
                                            margin: 1,
                                        }}
                                        variant='contained'
                                        onClick={() => {validateEmail()}}
                                    >Send</Button>
                                </div>
                            </div>
                            <div className="bar-chart-container">
                                <RadialBarChart name="Text Messages Sent" progress={phoneNumbersSent} goal={10}/>
                                <p className="mt-5 mb-3 mx-auto text-sm">Add Phone Numbers</p>
                                <div className="input-container">
                                    <PhoneNumberInput 
                                        id="PhoneNumber"
                                        userInput={input}
                                        errorText={errorText}
                                        inputErrors={inputErrors}
                                        setInputErrors={setInputErrors}
                                        setUserInput={setInput}
                                    />
                                </div>
                                <div className="button-container">
                                    <Button
                                        sx={{
                                            margin: 1,
                                        }}
                                        variant='contained'
                                        onClick={() => {validatePhoneNumber()}}
                                    >Send</Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            { (QRCodeDataUrl) ? (
                                    <Button
                                        variant="outlined"
                                        color="primary" 
                                        aria-label="Copy QR Code to Clipboard"
                                        onClick={() => {copyQRCodeToClipboard()}}
                                        startIcon={<QrCodeScannerIcon/>}
                                    >
                                        Copy QR
                                    </Button>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </div>
            }
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = await getProjectIDs();

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const projectData = await getProjectData(params.id);

    return {
        props: {
            projectData,
            projectID: params.id
        }
    };
}
