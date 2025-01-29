import React, { useEffect } from "react";


function NavBar(){

    const [isVisible, setisVisible] = useState(false);
    const [activeDropdown, setactiveDropdown] = useState(false);
    const timeoutRef= useRef(null);
    const showTimeoutRef=useRef(null);

    const mainLinks=[
        {name : "Home",path:"/"},
        {name : "Lost & Found",path:"/lost-found"},
        {name : "Buy & Sell",path:"/marketplace"},
        {name : "Profile",path:"/profile"},
    ];
    const academicOptions = [
      { name: "Attendance Tracker", path: "/attendance" },
      { name: "Academic Performance", path: "/academics" },
    ];

//     Swami Vivekanand Boys‘ Hostel
// Diamond Jubilee Girls Hostel
// PG Hostel
// K.N. Girls Hostel
// S.N. Girls Hostel
// International House (B-block) and Bachelor’s Flat
// R.N. Tagore Hostel
// C.V. Raman Hostel
// M.M. Malaviya Hostel
// B.G. Tilak Hostel
// S.V. Patel Hostel
// P.D. Tandon Hostel

    const hostelOptions=[
          {name : "Swami Vivekanand Boy's Hostel",path:"/SVBH"},
          {name : "Diamond Jubilee Girls Hostel",path:"/DJGH"},
    ]
    const handleMouseEnter= (dropdown)=>{
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        setactiveDropdown(dropdown)
    };
    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 300);
    };
    useEffect(()=>{
        return ()=>{
            if(timeoutRef.current) clearTimeout(timeoutRef.current)
        };
    },[]);









   
}