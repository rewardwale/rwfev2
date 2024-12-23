"use client"
import Image from 'next/image'
import React from 'react'
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className='bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300' style={{fontFamily:"Helvetica"}}>
      <div className='container mx-auto py-10 px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          
          {/* First Column */}
          <div className='flex flex-col items-center md:items-start'>
            <Image src="/RW_Black_Name.png" alt="logo" height={0} width={200} className='mb-2' />
            
          </div>

          {/* Second Column */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>Guides</h3>
            <ul>
              <li className='text-sm mb-1'><a className='hover:underline hover:text-blue-500 cursor-pointer' onClick={() => router.push("/howto")}>How to</a></li>
              <li className='text-sm mb-1'><a className='hover:underline hover:text-blue-500 cursor-pointer' onClick={() => router.push("/whatto")}>What to</a></li>
              <li className='text-sm mb-1'><a className='hover:underline hover:text-blue-500 cursor-pointer' onClick={() => router.push("/earnrewards")}>Earn Rewards & cash coins</a></li>
            </ul>
          </div>

          {/* Third Column */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>Company</h3>
            <p className='text-sm'>MSVP INNOVATIONS PRIVATE LIMITED</p>
            <p className='text-sm'>CIN: U62099MH2024PTC416592</p>
            <p className='text-sm'>GST: 27AARCM6409M1ZR</p>
          </div>

          {/* Fourth Column */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>Follow us</h3>
            <div className='flex space-x-3'>
              <a href="https://www.linkedin.com/company/rewardwale">
                <Image src="/linkedin-logo.png" alt='LinkedIn' height={30} width={30} className='hover:opacity-75 transition-opacity' />
              </a>
              <a href="https://www.instagram.com/rewardwale?igsh=aHQ4MTM5aTdidjBp">
                <Image src="/Instagram-logo.png" alt='Instagram' height={30} width={30} className='hover:opacity-75 transition-opacity' />
              </a>
              <a href="https://youtube.com/@rewardwale?si=zRF3T0WkJhAKV3Nb">
                <Image src="/youtube-logo.png" alt='YouTube' height={30} width={30} className='hover:opacity-75 transition-opacity' />
              </a>
            </div>
          </div> 
          
        </div>

        {/* Footer Section */}
        <div className='mt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-center md:text-left'>© 2024 rewardwale.com. All rights reserved.</p>
          <div className='flex space-x-4 mt-4 md:mt-0'>
            <a className='text-sm hover:underline hover:text-blue-500 cursor-pointer' onClick={() => router.push("/termscondition")}>Terms and Conditions</a>
            <a className='text-sm hover:underline hover:text-blue-500 cursor-pointer' onClick={() => router.push("/faq")}>FAQ's</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
