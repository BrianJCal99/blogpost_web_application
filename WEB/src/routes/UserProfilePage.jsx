import { useContext } from 'react';
import { SessionContext } from '../context/userSession.context';

const UserProfilePage = () => {
    const session = useContext(SessionContext);

    return (
        <div>
            {session ? (
                <div className="text-center my-3">
                    <h2>My Account</h2>
                    <h4>{session?.user?.user_metadata?.firstName + " " + session?.user?.user_metadata?.lastName || session?.user.email || "Display Name"}</h4>
                    <h5>{session?.user?.user_metadata?.userName || session?.user.email || "User Name"}</h5>
                    <h6>{session?.user.email || "User Email"}</h6>
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
