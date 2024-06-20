import './navbar.css';

interface Page {
    destination: string;
    label: string;
    SVG: JSX.Element;
}


const PAGES: Page[] = [
    {   label: 'Search', 
        destination: '',
        SVG: 
            <svg  
                xmlns="http://www.w3.org/2000/svg"  
                width="24"  
                height="24"  
                viewBox="0 0 24 24"  
                fill="none"  
                stroke="currentColor"  
                stroke-width="2"  
                stroke-linecap="round"  
                stroke-linejoin="round"  
                className="icon icon-tabler icons-tabler-outline icon-tabler-search fa-secondary"
            >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
            </svg>,
    },

    {   label: 'My Shelves', 
        destination: '',
        SVG: 
            // TODO: CREATE A CUSTOM SHELF SVG
            <svg  
                xmlns="http://www.w3.org/2000/svg"  
                width="24"  
                height="24"  
                viewBox="0 0 24 24"  
                fill="none"  
                stroke="currentColor"  
                stroke-width="2"  
                stroke-linecap="round"  
                stroke-linejoin="round"  
                className="icon icon-tabler icons-tabler-outline icon-tabler-server fa-secondary"
            >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                    <path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M7 8l0 .01" />
                    <path d="M7 16l0 .01" />
            </svg>,
    },

    {   label: 'Settings', 
        destination: '',
        SVG: 
        <svg  
            xmlns="http://www.w3.org/2000/svg"  
            width="24"  
            height="24"  
            viewBox="0 0 24 24"  
            fill="none"  
            stroke="currentColor"  
            stroke-width="2"  
            stroke-linecap="round"  
            stroke-linejoin="round"  
            className="icon icon-tabler icons-tabler-outline icon-tabler-settings fa-secondary"
        >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>,
    },
]


function Navbar() {
    // used to create each option in the navbar
    const mapper = (page: Page) => (
        <li className="nav-item">
            <a href={page.destination} className="nav-link">
                <span className="link-text">{page.label}</span>
                {/* SVG is just a placeholder for now*/}
                {page.SVG}
            </a>
        </li>
    );

    return(
        <nav className="navbar">
            <ul className="navbar-nav">
                {PAGES.map(mapper)}
            </ul>
        </nav>
    )
}

export default Navbar;