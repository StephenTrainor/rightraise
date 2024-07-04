import { useSession, signIn } from 'next-auth/react';
import Layout from '../components/layout';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <Navbar/>

      <div class="my-4 ml-4 mr-2 sm:m-8 lg:max-w-5xl lg:mx-auto">
        <p class="header1 centered mb-4 lg:mb-20">Donate to Programs That Matter</p>

        <hr class="mx-2 my-6 h-1 sm:my-12 lg:hidden"/>

        <p class="header2 centered">Non-profit.</p>
        <div class="info-container">
          <ul>
            <li class="bullet-point">All donations go straight to programs that benefit from your generous funding</li>
            <li class="bullet-point">We do not pursue a profit and do not take our own commission</li>
          </ul>
          <div class="image-container">
            <Image 
              alt="0% icon"
              src="/images/NoProfit.png"
              style={{ objectFit: 'contain' }}
              fill={true}
              className={"image"}
            />
          </div>
        </div>

        <p class="header2 centered">Secure.</p>
        <div class="info-container">
          <ul>
            <li class="bullet-point">PayPal handles and secures all transactions (PayPal charge a small fee for certain transactions)</li>
            <li class="bullet-point">We do not handle or have access to any valuable donations</li>
            <li class="bullet-point">No information about credit cards or users is recorded</li>
          </ul>
          <div class="image-container w-80">
            <Image
              alt="Padlock icon"
              src="/images/Secure.png"
              style={{ objectFit: 'contain' }}
              fill={true}
              className={"image"}
            />
          </div>
        </div>

        <p class="header2 centered">Simple.</p>
        <div class="info-container">
          <ul>
            <li class="bullet-point">Google authentication is used for straightforward and secure sign-ins</li>
            <li class="bullet-point">We only provide the necessary tools to get programs the funding they need: nothing less, nothing more</li>
          </ul>
          <div class="image-container w-76">
            <Image 
              alt="Simple checklist icon" 
              src="/images/Simple.png"
              style={{ objectFit: 'contain' }}
              fill={true}
              className={"image"}
            />
          </div>
        </div>

        <div class="text-xl sm:text-2xl md:text-3xl text-center align-middle">
          { (!session) ? 
            <p class="mt-8"><button onClick={() => signIn('google')} class="font-bold underline">Sign In</button> to get started</p> 
            :
            <p class="mt-8">View <Link class="text-white underline font-bold" href="/dashboard">Dashboard</Link></p>
          }
        </div>
      </div>
    </Layout>
  )
}
