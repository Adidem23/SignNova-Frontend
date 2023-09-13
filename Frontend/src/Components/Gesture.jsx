import { useState } from 'react';
import axios from 'axios';
import { abi } from './Input.json';
import { ethers } from 'ethers';
import { bytecode } from './Input.json';

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
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(provider, signer);

        const factory = new ethers.ContractFactory(abi, bytecode, signer);
        console.log(factory);
        const contract = await factory.deploy({gasLimit:500000});
        console.log("Here Is Deployed Contract Address" + await contract.getAddress());

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