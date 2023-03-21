import { Link, useMatch, useResolvedPath } from "react-router-dom"
import '../App.css'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPen, faBookOpen, faBars } from '@fortawesome/free-solid-svg-icons';
// export default function Navbar() {
//   return (
//     <nav className="nav" style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
//       <ul style={{ flex: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
//         <CustomLink to="/Home" icon={faHouse} />
//         <CustomLink to="/Edi" icon={faPen} />
//         <CustomLink to="/RunWay" icon={faBookOpen} />
//       </ul>
//     </nav>
//   )
// }
// export function CustomLink({ to, icon, ...props }) {
//   const resolvedPath = useResolvedPath(to)
//   const isActive = useMatch({ path: resolvedPath.pathname, end: true })
//   return (
//     <li className={isActive ? "active" : ""}>
//       <Link to={to} {...props}>
//         <FontAwesomeIcon icon={icon} />
//       </Link>
//     </li>
//   )
// }

import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, display: 'flex' }}>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {isVisible && (
          <motion.div
            key="modal"
            initial={{ background: "transparent", y: "100%" }}
            animate={{ background: "linear-gradient(to bottom, grey, teal)", y: "0%" }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 9999
            }}
          />
        )}
      </AnimatePresence>
      <nav
        style={{
          backgroundColor: '#333',
          color: '#fff',
          height: '100vh',
          width: isOpen ? '200px' : '0',
          overflow: 'hidden',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <CustomLink to="/Home" icon={faHouse} onClick={handleMenuClick} setIsVisible={setIsVisible} />
          <CustomLink to="/Edi" icon={faPen} onClick={handleMenuClick} setIsVisible={setIsVisible} />
          <CustomLink to="/RunWay" icon={faBookOpen} onClick={handleMenuClick} setIsVisible={setIsVisible} />
        </ul>
      </nav>
      <button
        style={{
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          padding: '10px',
          cursor: 'pointer',
        }}
        onClick={handleMenuClick}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
}

export function CustomLink({ to, icon, onClick, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  const [isVisible, setIsVisible] = useState(false);

  const handleLinkClick = (e) => {
    onClick && onClick();
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  return (
    <li style={{ padding: '10px', borderBottom: '1px solid #fff' }} className={isActive ? 'active' : ''}>
      <Link style={{ color: '#fff', textDecoration: 'none' }} to={to} onClick={handleLinkClick} {...props}>
        <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />
      </Link>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {isVisible && (
          <motion.div
            key="modal"
            initial={{ background: "transparent", y: "100%" }}
            animate={{ background: "linear-gradient(to bottom, grey, teal)", y: "0%" }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 9999
            }}
          />
        )}
      </AnimatePresence>
    </li>
  );
}
// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleMenuClick = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, display: 'flex' }}>
//       <nav
//         style={{
//           backgroundColor: '#333',
//           color: '#fff',
//           height: '100vh',
//           width: isOpen ? '200px' : '0',
//           overflow: 'hidden',
//           transition: 'width 0.3s ease-in-out',
//         }}
//       >
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           <CustomLink to="/Home" icon={faHouse} onClick={handleMenuClick} />
//           <CustomLink to="/Edi" icon={faPen} onClick={handleMenuClick} />
//           <CustomLink to="/RunWay" icon={faBookOpen} onClick={handleMenuClick} />
//         </ul>
//       </nav>
//       <button
//         style={{
//           backgroundColor: '#333',
//           color: '#fff',
//           border: 'none',
//           padding: '10px',
//           cursor: 'pointer',
//         }}
//         onClick={handleMenuClick}
//       >
//         <FontAwesomeIcon icon={faBars} />
//       </button>
//     </div>
//   );
// }

// export function CustomLink({ to, icon, onClick, ...props }) {
//   const resolvedPath = useResolvedPath(to);
//   const isActive = useMatch({ path: resolvedPath.pathname, end: true });

//   const handleLinkClick = () => {
//     onClick && onClick();
//   };

//   return (
//     <li style={{ padding: '10px', borderBottom: '1px solid #fff' }} className={isActive ? 'active' : ''}>
//       <Link style={{ color: '#fff', textDecoration: 'none' }} to={to} onClick={handleLinkClick} {...props}>
//         <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />
//       </Link>
//     </li>
//   );
// }