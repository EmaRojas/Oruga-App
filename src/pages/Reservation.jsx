import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { Create } from "../components/reservation/create";

import '../styles/home.css'


const Booking = () => {


  const { user } = UserAuth();



  return (
    <div class="container">

      <Create />
    </div>


  )
};

export default Booking;
