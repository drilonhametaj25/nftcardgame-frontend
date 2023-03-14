import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHOC, CustomButton, CustomInput } from '../components';
import styles from '../styles';
import { useGlobalContext } from '../context';

const CreateBattle = () => {
  const { contract, battleName, setBattleName} = useGlobalContext()
  const navigate = useNavigate()

  const handleClick = ()  => {

  }

  return (
    <>
      <div className='flex flex-col mb-5'>
        <CustomInput 
          label="Battle" 
          placeholder="Enter battle name" 
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton 
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />

        <p className={styles.infoText} onClick={() => navigate('/join-battle')}>Or join already existing battles</p>
      </div>
    </>
  )
};

export default PageHOC(CreateBattle, <>Create <br/> a new battle</>,<>Create your own battle and wait for other player to join you!</>);