import { useState } from 'react';
import axios from 'axios';
import { abi } from '../../../Hardhat/artifacts/contracts/Input.sol/HelloWorld.json';
import { ethers } from 'ethers';
import { bytecode } from '../../../Hardhat/artifacts/contracts/Input.sol/HelloWorld.json';
import { Wallet, Network, Alchemy, ContractFactory } from 'alchemy-sdk';


const Gesture = () => {

    const [Cont, setCont] = useState("");
    const [Account, setAccount] = useState("");

    const ConnectMetamask = async () => {
        const { ethereum } = window;
        const acc = document.getElementById('munde');

        const account = await ethereum.request({
            method: "eth_requestAccounts",
        });

        acc.innerHTML = account[0];

        setAccount(account[0]);

        ethereum.on('accountsChanged', async (accountnew) => {
            setAccount(accountnew[0]);
        })
    }


    const Submitinput = async (e) => {
        e.preventDefault();
        try {
            axios.post("http://localhost:6789/file", { file: Cont }, { withCredentials: true }).then(async (res) => {
                await DeployContract();
                console.log(res.data);
            }).catch((err) => {
                console.log(`Error is Ocuured ${err}`)
            })
        } catch (err) {
            console.log(`Error is Ocuured ${err}`)
        }

    }

    const DeployContract = async () => {
 
        const settings = {
            apiKey: "o6o_hG8wbBKWhm3TygqAOBbroOJBn-tj",
            network: Network.MATIC_MUMBAI,
        };

        console.log("Account is : "+Account);
        const alchemy = new Alchemy(settings);

        let wallet = new Wallet("5ad7f7823ac4a9518b1ce47b007c63c150bc31382d6878d48cce4abb2cc707ef", alchemy);

        
        console.log(wallet);

        let factory = new ContractFactory(abi, bytecode, wallet);
        console.log(factory)

        let contract = await factory.deploy({ gasLimit: 500000});
        console.log("contract Deployed : " + contract.address);

    }

    const SetInputcont = (e) => {
        setCont(e.target.value);
    }

    return (
        <>

            <div style={{ display: "block", margin: "auto", width: "fit-content" }}>
                <p>Contarct</p>
                <textarea onChange={SetInputcont} value={Cont}></textarea>

                <p>Account:<span id='munde'>{Account}</span></p>
                <button onClick={ConnectMetamask} >Connect</button>

                <button onClick={Submitinput}>Submit</button>

            </div>
        </>
    )
}

export default Gesture