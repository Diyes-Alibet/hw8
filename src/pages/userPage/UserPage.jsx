import {useState, useEffect} from "react";
import "./Userpage.module.css";

const URL = "http://localhost:8000/users";

function UserPage() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({name: "", email: "", username: ""});
    const [modalWindow, setModalWindow] = useState("");

    useEffect(() => {
        usersData();
    }, []);

    const usersData = async () => {
        try {
            const response = await fetch(URL);
            const json = await response.json();
            setUsers(json);
        } catch (error) {
            console.log("error loading users:", error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.username) {
            alert("All fields are required");
            return;
        }
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });
            if (response.ok) {
                setModalWindow("User successfully created");
                usersData();
                setForm({name: "", email: "", username: ""});
            }
        } catch (error) {
            console.log("error adding user:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`${URL}/${id}`, {method: "DELETE"});
            if (response.ok) {
                setModalWindow("User successfully deleted");
                usersData();
            }
        } catch (error) {
            console.error("error deleting user:", error);
        }
    };

    return (
        <div>
            <h1>User Table</h1>
            <form onSubmit={handleCreateUser}>
                <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}/>
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}/>
                <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}/>
                <button type="submit">CREATE</button>
            </form>
            {users.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td><button onClick={() => handleDeleteUser(user.id)}>DELETE</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>The list is empty</p>
            )}
            {modalWindow && (
                <>
                    <div className="modal-background" onClick={() => setModalWindow("")}></div>
                    <div className="modal">
                        <p>{modalWindow}</p>
                        <button onClick={() => setModalWindow("")}>CLOSE</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserPage;
