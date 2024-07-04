import Link from "next/link";
import Layout from "../components/layout";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

export default function Custom404() {
    const router = useRouter();

    return (
        <Layout>
            <Navbar title="Page Not Found"/>

            <div className="flex flex-col items-centered w-32 mx-auto space-y-8">
                <Button 
                    onClick={() => {router.replace(router.asPath)}}
                    variant="outlined"
                >
                    Refresh Page
                </Button>
                <Link href="/dashboard">
                    <div className="light-bg hover:hover-bg button-container2">
                        Go to Dashboard
                    </div>
                </Link>
            </div>
        </Layout>
    );
};
