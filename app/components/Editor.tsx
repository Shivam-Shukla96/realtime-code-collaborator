'use client';
import { useState, useEffect } from 'react'
import io from "socket.io-client"

const socket = io("http://localhost:3001")

const Editor = () => {

    const [content, setContent] = useState('')

    useEffect(() => {
        socket.on("edit", (data) => {
            setContent(data)
        })
        return () => {
            socket.off("edit")
        }
    }, [])


    interface EditEvent {
        target: {
            value: string;
        };
    }

    const handleChange = (event: EditEvent): void => {
        setContent(event.target.value)
        socket.emit("edit", event.target.value)
    }
    return (
        <div className='bg-neutral-700'>
            <p>Editor Component</p>
            <textarea
                value={content}
                onChange={handleChange}
                rows={10}
                cols={50}
                placeholder='start typing here'
            />


        </div>
    )
}

export default Editor
