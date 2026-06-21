'use client';

import { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/Sidebar';

import Editor from '@/app/components/Editor';

// Types
export interface Client {
    socketId: string;
    username: string;
}

// Constants
const INITIAL_CLIENTS: Client[] = [];

/**
 * Main editor wrapper component
 * Handles URL parameters and coordinates between Sidebar and Editor
 */
const EditorWrapper = () => {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

    // Get roomId from dynamic route parameter
    const params = useParams();
    const roomId = params.roomId as string;

    // Get username from URL search parameters
    const searchParams = useSearchParams();
    const username = searchParams.get('username') || 'Anonymous';

    return (
        <div className="bg-neutral-800 min-h-screen flex">
            <Sidebar clients={clients} roomId={roomId} />
            <main className="flex-1">
                <Editor
                    roomId={roomId}
                    username={username}
                    setClients={setClients}
                />
            </main>
        </div>
    );
};

// ===========Page Component==============

/**
 * Editor page component for collaborative code editing
 * Uses dynamic routing with [roomId] parameter
 * 
 * @route /editor/[roomId]?username=<username>
 */
const EditorPage = () => {
    return (
        <Suspense
            fallback={
                <div className="bg-neutral-800 min-h-screen flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                </div>
            }
        >
            <EditorWrapper />
        </Suspense>
    );
};

export default EditorPage;
