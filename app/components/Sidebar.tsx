import { useRouter } from 'next/navigation';
import { Client } from '../editor/[roomId]/page';

// Sidebar component displaying connected clients and room controls

export const Sidebar = ({ clients, roomId }: { clients: Client[]; roomId: string }) => {
    const router = useRouter();

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        // Could add toast notification here
    };

    const handleLeaveRoom = () => {
        router.push('/');
    };

    return (
        <aside className="w-1/6 min-w-[200px] p-4 border-r border-gray-600 text-white flex flex-col">
            {/* Header */}
            <div className="flex gap-4 p-4">
                <span className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center p-2">
                    CE
                </span>
                <h2 className="text-2xl text-blue-500">Collaborative Editor</h2>
            </div>

            {/* Clients List */}
            <div className="flex-1 mb-4">
                <h3 className="mb-4 font-semibold">Connected Users ({clients.length})</h3>
                <ul id="clients">
                    {clients.map((client) => (
                        <li key={client.socketId} className="flex items-center gap-2 mb-2">
                            <span className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center p-2">
                                {client.username.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-white">{client.username}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleCopyRoomId}
                    className="bg-neutral-400 hover:bg-neutral-500 transition-colors rounded-md p-2"
                >
                    Copy Room ID
                </button>
                <button
                    onClick={handleLeaveRoom}
                    className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-md p-2"
                >
                    Leave
                </button>
            </div>
        </aside>
    );
};