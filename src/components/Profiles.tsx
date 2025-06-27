//component that interacts with your table
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const Profiles = () => {
    const [profiles, setProfiles] = useState<any[]>([])

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data, error } = await supabase.from('profiles').select('*')
            if (error) console.error(error)
            else setProfiles(data)
        }

        fetchProfiles()
    }, [])

    return (
        <ul>
            {profiles.map(profile => (
                <li key={profile.id}>{profile.username}</li>
            ))}
        </ul>
    )
}

export default Profiles
