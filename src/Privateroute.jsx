import React from 'react'
import { Outlet } from 'react-router-dom';

function Privateroute(){
    return(
        <>
<div>This is Private Route</div>
<Outlet/>

</>
    )
}
export default Privateroute;