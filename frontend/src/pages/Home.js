import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]); // ✅ start with array
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:8080/products"; // ✅ corrected URL
            const options = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // ✅ proper format
                }
            };
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            setProducts(Array.isArray(result) ? result : []); // ✅ always array
        } catch (err) {
            handleError(err.message || 'Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Welcome{loggedInUser}</h1>
            <button onClick={handleLogout}>Logout</button>
            <div>
                {products.map((item, index) => (
                    <ul key={index}>
                        <span>{item.name} : {item.price}</span>
                    </ul>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
