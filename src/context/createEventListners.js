import { ethers } from "ethers";
import { ABI } from "../contract";

const addNewEvent = (eventFilter,provider,cb) => {
    provider.revomeListener(eventFilter) // to not have multiple listner ad same event at same time
    provider.on(eventFilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs)

        cb(parsedLog)
    })
}

export const createEventListners = ({navigate, contract, provider, walletAddres, setShowAlert, setUpdateGameData}) => {
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


    const NewBattleEventFilter = contract.filters.NewBattle();

    addNewEvent(NewBattleEventFilter, provider, ({args}) => {
        console.log('New Battle started',args, walletAddres)

        if(walletAddres.toLowerCase() === args.player1.toLowerCase() || walletAddres.toLowerCase() === args.player2.toLowerCase()){
            navigate(`/battle/${args.battleName}`)
        }

        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData+1)

    })
}