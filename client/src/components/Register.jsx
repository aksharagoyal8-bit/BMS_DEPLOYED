import {Form,Button,Input,message} from "antd";
import {Link,useNavigate} from "react-router-dom"
import { RegisterUser } from "../api/user";
export default function Register(){
    const navigate=useNavigate();
   const handleFinish = async (values) => {
    try {
        const data = await RegisterUser(values);
        
        if (data?.success) {          
            message.success(data.message);
            navigate("/login");
        } else {
            message.error(data?.message || "Something went wrong");
        }
    }
    catch (err) {
        message.error(err.response?.data?.message || err.message);
      
    }
};


    return(
        <>
        <header className="App-header">
            <main className="main-area mw-500 text-center px-3">
               <section className="left-section">
                   <h1>Register to BookMyShow</h1>
               </section>
               <section>
                <Form layout="vertical" onFinish={handleFinish}>
                     <Form.Item label="Name"
                    htmlFor="name"
                    name="name"
                    className="d-block"
                    rules={[{required:true,message:"Please enter your name"}]}
                    >
                        <Input id="name" type="text" placeholder="Enter your name"/>
                    </Form.Item>
                    
                    <Form.Item label="E-mail"
                    htmlFor="email"
                     name="email"
                    className="d-block"
                    rules={[{required:true,message:"Please enter a email"}]}
                    >
                        <Input id="email" type="text" placeholder="Enter your email"/>
                    </Form.Item>
                      <Form.Item label="Password"
                    htmlFor="password"
                     name="password"
                    className="d-block"
                    rules={[{required:true,message:"Please enter your password"}]}
                    >
                        <Input id="password" type="password" placeholder="Enter your password"/>
                    </Form.Item>


                      <Form.Item 
                    className="d-block"
                    
                    >
                        <Button type="primary" htmlType="submit">
                           Register
                        </Button>
                    </Form.Item>

                </Form>
                <div>
                    <p>Already a User? <Link to="/Login">Login</Link></p>
                </div>
               </section>
            </main>
        </header>
        </>
    )
}