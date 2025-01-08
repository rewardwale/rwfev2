import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure it only runs on the client

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.replace('/login'); // Redirect to login if no token
    }
  }, [router]);
}
