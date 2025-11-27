import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
const Contact = () => {
    return (
        <div>
            <Navbar/>
       
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-4 bg-white shadow rounded">
                <h1 className="mb-4">DHP SocialNetwork</h1>
                <p className="mb-2"><strong>Creator:</strong> Do Huu Phuc</p>
                <p className="mb-2"><strong>Date of Release:</strong> 25/10/2025</p>

                <h2 className="mt-4 mb-3">Contact:</h2>
                <ul className="list-unstyled">
                    <li className="mb-2"><strong>Email:</strong> phucnek169@gmail.com</li>
                    <li className="mb-2"><strong>Phone Number:</strong> 0964912821</li>
                    <li className="mb-2"><strong>Address:</strong> Dai Xuyen, Ha Noi</li>
                </ul>

                <p className="mt-4">Hope you have a great experience with our product!!!!</p>
            </div>
        </div>
        </div>
    );
};

export default Contact;
