import React, {
  createContext,
  CreateContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ethers, Signer } from "ethers";
import Web3Model from "web3modal";
import { useNavigate } from "react-router-dom";
import { ABI, ADDRESS } from "../contract";
import { createEventListners } from "./createEventListners";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  // Connect and interact with smartcontract
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const [showAlert, setShowAlert] = useState({status: false, type: 'info', message: ''})
  const [battleName, setBattleName] = useState('')
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null
  })

  const [updateGameData, setUpdateGameData] = useState(0)
  
  const navigate = useNavigate()

  // Set Wallet Address to the state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if(accounts) setWalletAddress(accounts[0])
    
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window.ethereum.on('accountsChanged', updateCurrentWalletAddress)
  }, [contract]);

  useEffect(() => {
    if(contract){
        createEventListners({
            navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData
        })
    }

  }, []);

  useEffect(() => {
   if(showAlert?.status){
    const timer = setTimeout(() => {
        setShowAlert({status: false, type: 'info', message: ''})
    }, [5000])

    return () => clearTimeout(timer) // clear alwayes timeout
   }
  }, [showAlert]);

  // Used fot set the smart contract to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3modal = new Web3Model();
      const connection = await web3modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);
      setProvider(newProvider)
      setContract(newContract)
    };

    setSmartContractAndProvider();
  });


  //* Set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles();
      const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0)
      let activeBattle = null;

      fetchedBattles.forEach((battle) => {
        if(battle.players.find((player) => player.toLowerCase() === walletAddress.toLocaleLowerCase())){
          if(battle.winner.startsWith('0x00')){
            activeBattle = battle
          }
        }
      })
      setGameData({pendingBattles: pendingBattles.slice(1), activeBattle})
    }

    if(contract) fetchGameData();
  }, [contract, updateGameData])

  // Pass object with every single component in the application
  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName, 
        setBattleName,
        gameData,
        setGameData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
