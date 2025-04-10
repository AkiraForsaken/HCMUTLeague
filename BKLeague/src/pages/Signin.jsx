import React, {useState} from 'react'
import './login.css'

const Signin = () => {
    const [state, setState] = useState("login");
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const handleChange = (field) => (e) => {
        setUserData((prev) => ({...prev, [field]: e.target.value,})
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const apiURL =
          state === "login"
            ? "http://localhost:8000/api/auth/login"
            : "http://localhost:8000/api/auth/register/team_member/player";
    
        const payload =
          state === "login"
            ? {
                username: userData.email,
                password: userData.password,
              }
            : {
                username: userData.email,
                password: userData.password,
                email: userData.email,
                first_name: userData.name.split(" ")[0] || "First",
                last_name: userData.name.split(" ")[1] || "Last",
                age: 20,
                com_street: "Test St",
                postal_code: "12345",
                squad_number: 9,
                position_player: "Midfielder",
                weight: 70,
                height: 175,
                team_name: "Test FC", // make sure this team exists in your DB
              };
    
        try {
          const res = await fetch(apiURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
    
          const result = await res.json();
    
          if (result.success) {
            if (state === "login") {
              localStorage.setItem("token", result.data.token);
              localStorage.setItem("role", result.data.role);
              alert("Login successful!");
              // You can navigate to a dashboard here
            } else {
              alert("Registration successful! You can now log in.");
              setState("login");
            }
          } else {
            alert(result.error);
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong.");
        }
    };
    return (
        <div className='mt-10'>
            <form 
            onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={handleChange("name")} value={userData.name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={handleChange("email")} value={userData.email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={handleChange("password")} value={userData.password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? 
                        <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">
                          click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an account? 
                        <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">
                          click here
                        </span>
                    </p>
                )}
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Signin