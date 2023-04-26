import React from 'react';
import styles from "./header.module.scss"
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={styles.header}>
            <Link to={"/"}><h1 className={styles.logo}>Haker News</h1></Link>
        </header>
    );
};

export default Header;