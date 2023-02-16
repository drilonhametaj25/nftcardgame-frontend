import React from 'react';
import { PageHOC } from '../components';

const CreateBattle = () => {
  return (
    <div>
        <h1 className='text-white text-xl'>Hello </h1>
    </div>
  )
};

export default PageHOC(CreateBattle, <>Create <br/> a new battle</>,<>Create your own battle and wait for other player to join you!</>);