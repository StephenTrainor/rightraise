import Layout from "../../components/layout";
import Navbar from "../../components/Navbar";
import { db } from '../../firebase';
import { collection, updateDoc, getDocs, where, query, doc } from 'firebase/firestore';
import { getProjectIDs, getProjectData } from "../../lib/projects";

export default function Donate({projectData, projectID}) {
    return (
        <Layout>
            <Navbar />
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
