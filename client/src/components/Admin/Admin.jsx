import React, { Children } from "react";
import {Tabs} from "antd";
import MovieList from "./MovieList";
import TheatersTable from "./TheatersTable";

export default function Admin(){

    const tabItems=[
        {
            key:"1",
            label:"Movies",
            children:<MovieList/>,
        },
        {
            key:"2",
            label:"Theaters",
            children:<TheatersTable/>,
        }
    ]
    return(
        <div>
            
            <h1>Welcome to Admin Panel!</h1>

         <Tabs defaultActiveKey="1" items={tabItems}/>

        </div>
       
    )
}