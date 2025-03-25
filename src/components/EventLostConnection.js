import { useState } from "react";
import React from 'react'
import LostConnectionsList from "./LostConnectionList";

export default function EventLostConnections({ connections }) {
    console.log(connections);
    const [joined, setJoined] = useState(false)

    async function joinLostConnection({ event }) {
        try {
            const method = 'POST';
            const request = await fetch(`/api/event/${event}/lostConnections`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (request.ok) return setJoined(joined ? false : true);
            if (!request.ok) throw new Error('Failed to update invite state');
            // setLoading(false)

        } catch (error) {
            console.error('Error updating invite state:', error);
        }
    }
    return (
        <div>
            <h2>Lost Connections</h2>
            <button onClick={() => joinLostConnection()}>Join</button>


            <LostConnectionsList />
            {/* {connections?.map(user => <li key={user._id}>{user.username}</li>)} */}

        </div>
    )
}