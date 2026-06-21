'use client';

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { closeBrackets, closeBracketsKeymap, autocompletion } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { html } from '@codemirror/lang-html';
import toast from 'react-hot-toast';

import initSocket from '../socket';

// ================Constants=========================== 
const DEBOUNCE_DELAY = 300; // milliseconds
const REMOTE_CHANGE_RESET_DELAY = 100; // milliseconds
const INITIAL_EDITOR_CONTENT = '// Start typing your code here...\n';

// Types
interface Client {
    socketId: string;
    username: string;
}

interface EditorProps {
    roomId: string;
    username: string;
    setClients: (clients: Client[]) => void;
}

// ================Component===========================

/**
 * Editor Component - Real-time collaborative code editor
 * 
 * Provides a CodeMirror-based editor that allows multiple users to collaborate
 * in real-time using Socket.IO for synchronization.
 * 
 * @features
 * - Syntax highlighting for JavaScript/JSX and HTML
 * - Auto-closing brackets and tags
 * - Real-time collaboration via WebSocket
 * - Dark theme (One Dark)
 * - Auto-completion and intelligent code suggestions
 * - Debounced change synchronization for performance
 * 
 * @param props - Component props
 * @returns Editor component with real-time collaboration
 */
const Editor = ({ roomId, username, setClients }: EditorProps) => {
    // Refs

    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    // Ref to store the Socket.IO connection instance
    const socketRef = useRef<Socket | null>(null);
    const isRemoteChange = useRef<boolean>(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const lastReceivedContent = useRef<string>('');

    // ===================Effects=========================

    /**
     * Main effect - Initializes editor and socket connection
     * Cleanup on unmount: disconnects socket, destroys editor view
     */
    useEffect(() => {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        const handleUserJoined = (data: { username: string; socketId: string; activeClients: Client[] }) => {
            const { username: joinedUsername, socketId, activeClients } = data;

            if (joinedUsername !== username) {
                toast.success(`${joinedUsername} joined the room`);
            }

            console.log(`User joined: ${joinedUsername} (${socketId})`, activeClients);
            setClients(activeClients);
        };

        const handleUserLeft = (data: { username: string; socketId: string; activeClients: Client[] }) => {
            const { username: leftUsername, socketId, activeClients } = data;

            toast(`${leftUsername} has left the room.`);
            console.log(`User left: ${leftUsername} (${socketId})`, activeClients);
            setClients(activeClients);
        };


        const handleRemoteEdit = (content: string) => {
            if (!viewRef.current) return;

            const currentContent = viewRef.current.state.doc.toString();

            // Skip if content hasn't changed or is duplicate
            if (currentContent === content || lastReceivedContent.current === content) {
                return;
            }

            lastReceivedContent.current = content;
            isRemoteChange.current = true;

            const selection = viewRef.current.state.selection.main;

            viewRef.current.dispatch({
                changes: {
                    from: 0,
                    to: currentContent.length,
                    insert: content
                },
                selection: {
                    anchor: Math.min(selection.anchor, content.length),
                    head: Math.min(selection.head, content.length)
                }
            });

            setTimeout(() => {
                isRemoteChange.current = false;
            }, REMOTE_CHANGE_RESET_DELAY);
        };


        const handleConnectionError = (err: Error) => {
            console.error('Socket connection error:', err);
            toast.error('Connection error. Please check if server is running.');
        };


        const createEditorExtensions = () => [
            basicSetup,
            javascript({ jsx: true }),
            html({ autoCloseTags: true }),
            oneDark,
            closeBrackets(),
            autocompletion(),
            keymap.of(closeBracketsKeymap),

            // Document change listener with debouncing
            EditorView.updateListener.of((update) => {
                if (update.docChanged && !isRemoteChange.current) {
                    const content = update.state.doc.toString();

                    if (debounceTimer.current) {
                        clearTimeout(debounceTimer.current);
                    }

                    debounceTimer.current = setTimeout(() => {
                        socketRef.current?.emit('edit', content);
                        console.log('Emitting edit event (debounced), length:', content.length);
                        debounceTimer.current = null;
                    }, DEBOUNCE_DELAY);
                }
            }),

            // Custom theme
            EditorView.theme({
                '&': {
                    height: '100%',
                    fontSize: '14px',
                },
                '.cm-scroller': {
                    fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                },
                '.cm-content': {
                    minHeight: '400px',
                }
            })
        ];

        /**
         * Initializes socket connection and sets up event listeners
         */
        const initializeSocket = async () => {
            socketRef.current = await initSocket();

            console.log(`Joining room: ${roomId} as ${username}`);

            socketRef.current.emit('join', { roomId, username });

            socketRef.current.on('user-joined', handleUserJoined);
            socketRef.current.on('user-left', handleUserLeft);
            socketRef.current.on('edit', handleRemoteEdit);
            socketRef.current.on('connect_error', handleConnectionError);
        };

        //    Creates and initializes the CodeMirror editor
        const initializeEditor = () => {
            if (!editorRef.current) return null;

            const startState = EditorState.create({
                doc: INITIAL_EDITOR_CONTENT,
                extensions: createEditorExtensions()
            });

            const view = new EditorView({
                state: startState,
                parent: editorRef.current
            });

            viewRef.current = view;
            return view;
        };

        const view = initializeEditor();
        initializeSocket();

        // Cleanup function
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            if (socketRef.current) {
                console.log('Disconnecting socket');
                socketRef.current.off('user-joined');
                socketRef.current.off('user-left');
                socketRef.current.off('edit');
                socketRef.current.off('connect_error');
                socketRef.current.disconnect();
            }

            if (view) {
                view.destroy();
                viewRef.current = null;
            }
        };
    }, [roomId, username, setClients]);

    //   ===================Render=========================
    if (typeof window === 'undefined') {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div
                ref={editorRef}
                className="w-full h-full border border-gray-700 overflow-hidden"
            />
        </div>
    );
};

export default Editor;
