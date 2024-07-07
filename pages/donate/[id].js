import Layout from "../../components/layout";
import Navbar from "../../components/Navbar";
import TextInput from "../../components/TextInput";
import DollarInput from "../../components/DollarInput";
import Alert from '@mui/material/Alert';
import { useState } from "react";
import { getProjectIDs, getProjectData } from "../../lib/projects";
import { PayPalButton } from "react-paypal-button-v2";
import { useRouter } from "next/router";

const axios = require("axios");

export default function Donate({projectData, projectID}) {
    const [formError, setFormError] = useState(false);
    const [userInput, setUserInput] = useState({
        "Name": "",
        "Message": "",
        "Amount": 0,
    });
    const [inputErrors, setInputErrors] = useState({
        "Name": false,
        "Message": false,
        "Amount": 0,
    });
    const router = useRouter();

    const updateUserInput = (e) => {
        setUserInput({
            ...userInput,
            [e.target.id]: e.target.value
        });
    };

    return (
        <Layout>
            <Navbar />

            <div className="mt-12 md:mt-8 space-y-4 mx-auto w-56 sm:w-80 md:w-96 flex flex-col">
                <TextInput 
                    id="Name"
                    userInput={userInput}
                    update={updateUserInput}
                    inputError={inputErrors}
                    setInputErrors={setInputErrors}
                />
                <TextInput 
                    id="Message"
                    userInput={userInput}
                    update={updateUserInput}
                    inputError={inputErrors}
                    setInputErrors={setInputErrors}
                    multiline
                />
                <DollarInput 
                    id="Amount"
                    userInput={userInput}
                    inputErrors={inputErrors}
                    setUserInput={setUserInput}
                    setInputErrors={setInputErrors}
                />
                { (formError) ? (
                    <Alert severity="error">All Fields Must Be Completed</Alert>
                ) : (
                    <></>
                )}
            </div>

            <PayPalButton
                amount={`${userInput.Amount}`}
                currency="USD"
                options={{
                    // merchantId: "ATMRWafaGUcstVMAdHpCThqKtSpM3S8x83lrQf1D8Rl_28ULNIg5_0wiL3DB2seLYQ0RX-9LQJPyTikn", 
                    clientId: "ATMRWafaGUcstVMAdHpCThqKtSpM3S8x83lrQf1D8Rl_28ULNIg5_0wiL3DB2seLYQ0RX-9LQJPyTikn", // FINISH THIS: SEND PAYMENTS TO FUNDRAISERS DIRECTLY
                    // clientId: "AW9zwZxaKAORXHWe4zgw2dUHyGeEACOPMcBadDy_o1Tj0gw-3g-oe9sbTIJacbBXple9cGMn5nj9VXp3"
                }}
                catchError={(err) => {
                    setFormError(true);
                    console.error(err);
                }}
                onError={(err) => {
                    setFormError(true);
                    console.error(err);
                }}
                onSuccess={async (details, data) => {
                    console.log(details); // why not
                    console.log(data);

                    const response = await axios.post("../api/paypal/newDonation", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: {
                            amount: userInput["Amount"],
                            name: userInput["Name"],
                            message: userInput["Message"],
                            projectData: projectData,
                            projectID, projectID
                        },
                    });

                    console.log(response);

                    router.push(`/thankyou/${projectID}`);
                }}
            />
        </Layout>
    );
};

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
            projectID: params.id,
        },
    };
}
