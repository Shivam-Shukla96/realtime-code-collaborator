import Image from "next/image";
import Editor from "./components/Editor";

export default function Home() {
  return (
    <div className="p-4 bg-neutral-800">
      <h1>Welcome to the Real Time Code Collaboration Platform</h1>
      <p>Build | Collaborate | Share</p>

      <Editor />



    </div>
  );
}
