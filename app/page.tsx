'use client'
import { useState, } from "react";
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-hot-toast";

export default function Home() {

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleCreateRoom = () => {
    const id = uuidv4();
    setRoomId(id);
    toast.success(`Created a new room with ID: ${id}`);
  }

  const handleJoinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room ID and Username are required");
      return;
    }
    // Logic to join the room goes here
    router.push(`/editor/${roomId}?username=${username}`);
    toast.success(`Joining room: ${roomId} as ${username}`);

  }
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  }

  return (
    <div className="p-4 bg-neutral-800 min-h-screen text-white flex flex-col items-center justify-center">
      <h1>Welcome to the Real Time Code Collaboration Platform</h1>
      <p>Build | Collaborate | Share</p>

      {/* <Editor /> */}

      <div className="mt-6 w-md h-md border-2 border-neutral-600 rounded-lg overflow-hidden">

        <h1 className="text-2xl p-2 text-center" >CodeBuddy</h1>
        <input
          type="text"
          placeholder="Enter Room ID"
          className="w-full p-2 border-b-2 border-neutral-600 bg-neutral-700 text-white outline-none"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={handleEnter}
        />
        <input
          type="text"
          placeholder="Enter Your username"
          className="w-full p-2 border-b-2 border-neutral-600 bg-neutral-700 text-white outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleEnter}

        />
        <div className="flex flex-col items-center justify-center p-4 bg-neutral-700 h-[400px]">
          <p className="mb-4">Join a room to start collaborating in real-time!</p>

          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Join Room
          </button>
          <span>if you do not have a room, create one!
            <button
              onClick={handleCreateRoom}

              className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Create Room</button>
          </span>

        </div>

      </div>

      <footer>
        <p className="text-center mt-6 text-sm text-neutral-500">
          Built with ❤️ by
          <a
            href="https://github.com/Shivam-Shukla96/"
            target="_blank" rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 "> Shivam </a>
        </p>
        <p className="text-center mt-6 text-sm text-neutral-500">  &copy; 2025 Real Time Code Collaboration Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// take input in sate , 
// creae room id using uuid