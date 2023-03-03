import { useEffect, useState } from "react";

function Dashboard(props) {

    const [token , setToken] = useState("");
    const [user , setUser] = useState("");

    const getDashboard = async () => {
        // Function get data dashboard
        setUser(props.user);

        // ini untuk set user
        setToken(user.accessToken);
    }

    useEffect(() => {
        getDashboard();
    })

    return (
        <>
            <div>
                <h1>
                    Hello Admin {props.user.username}
                </h1>
                <h3>
                    Ini Token Anda : <br/> {token}
                </h3>
            </div>
        </>
    )
}

export default Dashboard;