import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { collection, updateDoc, getDocs, getDoc, where, query, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from'@mui/material/Button';
import TextField from '@mui/material/TextField';
import Layout from '../components/layout';
import Navbar from '../components/Navbar';
import utilStyles from '../styles/utils.module.css';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
    const router = useRouter();
    const { data: session } = useSession();

    const [errorText, setErrorText] = useState('');
    const [codeError, setCodeError] = useState(false);
    const [projectCode, setProjectCode] = useState('');
    const [userID, setUserID] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [joinedProjects, setJoinedProjects] = useState(null);
    const [ownedProjects, setOwnedProjects] = useState(null);

    const updateProjectParticipantIDs = async (documentReference, documentSnapshot, documentData) => {
        const userReference = doc(db, "users", userID);
        await updateDoc(userReference, {
            projectsJoined: [...userProfile.projectsJoined, documentSnapshot.id],
        });

        await updateDoc(documentReference, {
            projectParticipantIDs: [...documentData.projectParticipantIDs, userID],
        });
    };

    const validateCode = async () => {
        const projectReference = doc(db, "projects", projectCode.trim());
        const projectSnapshot = await getDoc(projectReference);

        if (projectSnapshot.exists()) {
            const projectData = projectSnapshot.data();

            if (projectData.projectOwnerID === userID) {
                setCodeError(true);
                setErrorText('Already created');
            }
            else if (projectData.projectParticipantIDs.indexOf(userID) !== -1) {
                setCodeError(true);
                setErrorText('Already joined')
            }
            else {
                await updateProjectParticipantIDs(projectReference, projectSnapshot, projectData);
                router.push(`/projects/${projectSnapshot.id}`);
            }
        } else {
            setCodeError(true);
            setErrorText('Enter valid code')
        }
    };

    const setEnteredCode = (event) => {
        if (!event.target.value) {
            setCodeError(true);
            setErrorText('Enter a code')
        }
        else {
            setCodeError(false);
            setErrorText('')
        }
        setProjectCode(event.target.value);
    }

    const getUserProfile = async (userEmailAddress) => {
        const usersQuery = query(collection(db, "users"), where("emailAddress", "==", userEmailAddress));
        const usersQuerySnapshot = await getDocs(usersQuery);
    
        usersQuerySnapshot.forEach((doc) => {
            setUserProfile({
                ...doc.data(),
            });
            setUserID(doc.id);
        });
    };

    const getUserProjects = async (userID) => {
        const projectsOwnedQuery = query(collection(db, "projects"), where("projectOwnerID", "==", userID));
        const projectsOwnedSnapshot = await getDocs(projectsOwnedQuery);
        var tempOwnedProjects = {};

        projectsOwnedSnapshot.forEach((doc) => {
            tempOwnedProjects[doc.id] = {"id": doc.id, ...doc.data()}
        });
        setOwnedProjects({
            ...ownedProjects,
            ...tempOwnedProjects,
        });

        const projectsJoinedQuery = query(collection(db, "projects"), where("projectParticipantIDs", "array-contains", userID));
        const projectsJoinedSnapshot = await getDocs(projectsJoinedQuery);
        var tempJoinedProjects = {};

        projectsJoinedSnapshot.forEach((doc) => {
            tempJoinedProjects[doc.id] = {"id": doc.id, ...doc.data()}
        });
        setJoinedProjects({
            ...joinedProjects,
            ...tempJoinedProjects,
        });
    };

    useEffect(() => {
        if (!session) return;

        getUserProfile(session.user.email);
    }, [session]);

    useEffect(() => {
        if (!userProfile) return;

        getUserProjects(userID);
    }, [userProfile]);

    if (!userProfile) {
        return (
            <Layout title="Dashboard">
                <Navbar title="Dashboard"/>

                { (!session) ?
                    <div class="text-3xl text-center align-middle">
                        <p class="m-4">Nothing to display on the Dashboard</p>
                        <p class="mt-8"><button onClick={() => signIn('google')} class="font-bold underline">Sign In</button> to get started</p>
                    </div>
                :
                    <div className={utilStyles.container}>
                        <div className={utilStyles.cascade}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                }
            </Layout>
        );
    }

    return (
        <Layout title="Dashboard">
            <Navbar title="Dashboard"/>

            <p class="text-2xl mb-4 md:mb-8 md:text-3xl centered">Welcome {(session) ? session.user.name : ""}</p>

            <div className="m-2 flex flex-col">
                <div className="flex flex-col lg:flex-row all-projects-container mx-auto content-between lg:justify-center items-center mb-4">
                    <Link className="mx-auto lg:ml-auto" href="/create">
                        <div className="light-bg hover:hover-bg button-container2">
                            Create Project
                        </div>
                    </Link>
                    <p className="mx-auto lg:mx-4">or</p>
                    <div className="mx-auto lg:mr-auto">
                        <TextField 
                            required
                            error={codeError}
                            label="Enter Code"
                            helperText={errorText}
                            variant="outlined" 
                            id="projectCode" 
                            value={projectCode} 
                            onChange={(e) => setEnteredCode(e)} 
                            autoComplete='off'
                        />
                        <Button
                            sx={{
                                margin: 1,
                            }}
                            variant='contained'
                            onClick={() => { validateCode(); }}
                        >Join</Button>
                    </div>
                </div>
                <div className="mx-auto all-projects-container">
                    { (ownedProjects) ?
                        Object.values(ownedProjects).map((project) => (
                            <Link href={`/projects/${project.id}`}>
                                <div className="project-container light-bg hover:hover-bg">
                                    <p className="mr-auto dark-text">{`${project.name} (Owner)`}</p>
                                    <ProgressBar donations={project.donations} goal={project.goal} />
                                </div>
                            </Link>
                        )) : <></>
                    }
                    { (joinedProjects) ?
                        Object.values(joinedProjects).map((project) => (
                            <Link href={`/projects/${project.id}`}>
                                <div className="project-container light-bg hover:hover-bg">
                                    <p className="mr-auto dark-text">{project.name}</p>
                                    <ProgressBar donations={project.donations} goal={project.goal} />
                                </div>
                            </Link>
                        )) : <></>
                    }
                </div>
            </div>
        </Layout>
    );
}
