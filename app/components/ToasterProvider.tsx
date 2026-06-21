'use client';

import { Toaster } from 'react-hot-toast';

/**
 * ToasterProvider - Client component wrapper for react-hot-toast
 * 
 * This component wraps the Toaster in a client component to avoid
 * hydration errors when used in the root layout
 */
export default function ToasterProvider() {
    return <Toaster position="top-right" reverseOrder={false} />;
}
