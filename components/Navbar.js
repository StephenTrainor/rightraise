import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({title}) {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        // <header class="flex grow max-h-16 justify-center items-center text-white m-3 sm:m-5">
        <header class="flex justify-center items-center text-white m-3 sm:m-5">
            <div class="flex-1 justify-center flex">
                <div class="mr-auto w-10 sm:w-16 h-10 sm:h-16 relative inline-block">
                    <Image 
                        alt="Circled check mark Icon for the RightRaise website"
                        src="/images/Icon.png"
                        width={100}
                        height={100}
                        onClick={() => router.push("/")}
                    />
                </div>
            </div>

            <div class="flex-none md:flex-1 justify-center hidden md:flex">
                <p class="invisible md:visible text-center md:text-xl lg:text-2xl">{title || "RightRaise"}</p>
            </div>

            <div class="flex-none md:flex-1 justify-center flex">
                <nav class="ml-auto list-none inline-block">
                    <ul class="">
                        <li class="inline-block p-3 sm:p-4 mr-2 sm:mr-3">
                            { (session) ? 
                                <button onClick={() => signOut()}>Log Out</button> :
                                <button onClick={() => signIn('google')}>Sign In</button>
                            }
                        </li>
                        <li className="inline-block text-border"><Link href="/dashboard">Dashboard</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
