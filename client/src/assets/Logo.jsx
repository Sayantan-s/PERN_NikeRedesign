import React from 'react';
import { Link } from 'components';

const Logo = ({ className }) => {
    return (
        <Link to="/">
            <svg className={className} height="80px" width="80px" fill="#111" viewBox="0 0 69 32">
                <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28q-4.8 0-6.96-3.36-1.36-2.16-.8-5.48t2.96-7.08q2-3.04 6.56-8-1.6 2.56-2.24 5.28-1.2 5.12 2.16 7.52Q11.2 18 14 18q2.24 0 5.04-.72z" />
            </svg>
        </Link>
    );
};

export default Logo;
