import {BrowserRouter,Routes,Route} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';
import Home from './components/Home';
import Login from "./components/Login";
import Register from "./components/Register";
import {Provider} from "react-redux";
import store from "./redux/store";
import Admin from "./components/Admin/Admin";
import Partner from "./components/Partner/Partner";
import SingleMovie from "./components/SingleMovie";
import BookShow from "./components/BookShow";
import Forget from "./components/Forget";
import Reset from "./components/Reset";
import Profile from "./components/Profile/Profile";




function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<ProtectedRoute>
      <Home/>
    </ProtectedRoute>}/>
    <Route path="/login" element={<Login/>}/>
     <Route path="/register" element={<Register/>}/>
     <Route path="/forgot-password" element={<Forget/>}/>
     <Route path="reset-password" element={<Reset/>}/>
     <Route path="/admin" element={
      <ProtectedRoute>
        <Admin/>
      </ProtectedRoute>
     }/>

     <Route path="/partner" element={
      <ProtectedRoute>
        <Partner/>
      </ProtectedRoute>
     }/>
     <Route path="/profile" element={
       <ProtectedRoute>
        <Profile/>
      </ProtectedRoute>
     }/>


     <Route path="/movie/:id" element={
      <ProtectedRoute>
        <SingleMovie/>
      </ProtectedRoute>
     }/>
     <Route path="/book-show/:id" 
     element={
      <ProtectedRoute>
      <BookShow/>
      </ProtectedRoute>
     }
     />
  </Routes>
  </BrowserRouter>
    </Provider>
  
  );
}

export default App;
