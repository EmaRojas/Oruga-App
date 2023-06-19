import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { Create } from "../components/reservation/create";
import { Table } from "../components/reservation/table";

import '../styles/home.css'


const Reservation = () => {


  const { user } = UserAuth();



  return (
    <div class="container">

      <Table />
    </div>


  )
};

export default Reservation;
