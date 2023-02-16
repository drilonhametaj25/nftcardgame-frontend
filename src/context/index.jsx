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

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    // Connect and interact with smartcontract
    const [walletAddress, setWalletAddress] = useState('')

    const updateCurrentWalletAddress = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        console.log(accounts)
    }

    useEffect(() => {
        updateCurrentWalletAddress();
    }, [])

    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3modal = new Web3Model()
            const connection = await web3modal.connect()
            const newProvider = new ethers.providers.Web3Provider(connection)
            const signer = newProvider.signer()
            const newContract = new ethers.Contract();
        }

        setSmartContractAndProvider()
    })
    // Pass object with every single component in the application
    return (
        <GlobalContext.Provider value={{
            demo: 'test'
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)
