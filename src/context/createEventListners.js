import { ethers } from "ethers";
import { ABI } from "../contract";

const addNewEvent = (eventFilter,provider,cb) => {
    provider.revomeListener(eventFilter) // to not have multiple listner ad same event at same time
    provider.on(eventFilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs)

        cb(parsedLog)
    })
}

export const createEventListners = ({navigate, contract, provider, walletAddres, setShowAlert}) => {
    const NewPlayerEventFilter = contract.filters.NewPlayer();

    addNewEvent(NewPlayerEventFilter, provider, ({args}) => {
        console.log('New Player created',args)

        if(walletAddres === args.owner){
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Player created succesfully!'
            })
        }
    })
}