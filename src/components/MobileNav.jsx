import { NavLink } from "react-router-dom";
import { Home, Heart, User, MailOpenIcon, MailPlusIcon } from "lucide-react";

export default function MobileNav() {
  const linkClass = "flex flex-col items-center text-xs";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      <NavLink to="/dashboard" className={linkClass}>
        <Home size={20} />
        Home
      </NavLink>

      <NavLink to="/matches" className={linkClass}>
        <Heart size={20} />
        Matches
      </NavLink>

      <NavLink to="/profile" className={linkClass}>
        <User size={20} />
        Profile
      </NavLink>


      <NavLink to="/received" className={linkClass}>
        <MailPlusIcon size={20} />
        Received
      </NavLink>

      <NavLink to="/sent" className={linkClass}>
        <MailOpenIcon size={20} />
        Sent
      </NavLink>
    </div>
    
  );
}
