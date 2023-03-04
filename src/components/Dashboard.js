import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {
    const [dashbaord, setDashboard] = useState({});

    const getDashboard = async (token) => {
        // ini untuk set user
        axios.get("http://localhost:3000/api/v1/dashboard", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setDashboard(res.data.data);
        }).catch(error => {
            console.log(error.response.data);
        });
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('user');
        const object = JSON.parse(storedToken);
        if (object) {
            getDashboard(object.accessToken);
        }
    }, []);

    return (
        <>
            <div className="container">
                <h1>
                    Hello Admin
                </h1>
                <div className="row">
                    {(dashbaord.content) ?
                        dashbaord.content.map(item => (
                            <div key={item.title} className={"mt-2 col-md-" + item.grid}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.title}</h5>
                                        <p className="card-text">Total : {item.count} </p>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        null
                    }
                </div>
                <div class="row mt-5">
                    <div class="col-md-12">
                        <h3>Table Rooms </h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <td>Code</td>
                                    <td>Status</td>
                                    <td>Winner</td>
                                </tr>
                            </thead>
                            <tbody>
                            {(dashbaord.rooms) ?
                                dashbaord.rooms.map(item => (
                                    <tr>
                                        <td>{ item.kode }</td>
                                        <td>{ item.status }</td>
                                        <td>
                                            { (item.user) ? item.user.email : "Belum Ada Pemenang" }
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td colspan="3"> Data Tidak Ditemukan!</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;