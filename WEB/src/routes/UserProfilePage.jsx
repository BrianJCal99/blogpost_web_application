import { useContext } from 'react';
import { SessionContext } from '../context/userSession.context';

const UserProfilePage = () => {
    const session = useContext(SessionContext);

    return (
        <div>
            {session ? (
                <div className="text-center">
                    <h2>Welcome</h2>
                    <h4>{session?.user?.user_metadata?.firstName + " " + session?.user?.user_metadata?.lastName || session?.user.email || "User"}</h4>
                    <h6>{session?.user.email}</h6>
                </div>
            ) : (
                <div className="text-center">
                    <h1>Not logged in</h1>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
