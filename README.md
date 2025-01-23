# [Decentralized-AI-ToDo](https://modern-ai-todo.netlify.app/)
A decentralized ToDo app integrated with an open source AI agent: [View Application](https://modern-ai-todo.netlify.app/)

#### Tech Stack:
**Frontend**: React JS (Hosted on netflify) <br />
**Backend**: Node JS, Express JS (AWS Elastic Beanstalk) <br />
**Blockchain**: Solidity smart contract (Polygon Amoy Testnet) 
**AI Model**: Meta-llama/Llama-3.2-1B-Instruct (Open Source)

***

#### Endpoints:
**Frontend**: https://modern-ai-todo.netlify.app <br />
**Backend**: https://gpt4-web3-todo-app.ap-south-1.elasticbeanstalk.com/ <br />
**Smart contract Address**: 0xe2516BF6d888E040f619dd1157f423bA3be96D88 <br />
**Verify Contract**: https://amoy.polygonscan.com/txs?a=0xe2516BF6d888E040f619dd1157f423bA3be96D88&p=1
**ABI File**: https://drive.google.com/file/d/11RIHW432wGiPrYE8IcDaer-QdIaTGPyG/view?usp=sharing

***

#### System design & usage notes: 
1. The frontend of this application does **NOT** handle any business logic or blockchain transactions. 
2. The frontend connects to the user wallet and requests the backend for an auth token (JWT).
3. The backend sends back auth token, and from that point every request from frontend includes auth token inside headers - without that the request will fail.
4. For using this app on PC, install [MetaMask extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en). For mobile, install [MetaMask application](https://play.google.com/store/apps/details?id=io.metamask&hl=en_IN), since regular browser windows don't have access to Ethereum.
5. Connect to [Polygon Amoy Testnet](https://chainlist.org/chain/80002). You won't need POL currency to pay gas fee for using this application, as the backend is signing the transactions with its own private key. 
6. To enable connection to backend inside MetaMask browser, the backend uses **CloudFront as CDN**, because MetaMask has a rare issue of [relying exclusively on the (centralized) list of root certs provided by the metamask team.](https://github.com/MetaMask/metamask-mobile/issues/3422) - it trusts CloudFront issued SSL certificates.
7. The AI agent integrated with this application is an **open source AI model** (meta-llama/Llama-3.2-1B-Instruct) available on GPT4All, integrated using **Hugging Face**.
8. The app has a live task completion chart integrated using d3.js

***

#### Local installation & setup:
1. Clone this repository.
2. Run ```npm install``` inside both directories - frontend and backend.
3. Inside backend folder, create a ```.env``` file and add following keys: 
```&nbsp; &nbsp; ANKR_POLYGON_RPC_URL 
PRIVATE_KEY (MetaMask Wallet Key + 0x appended in front) 
TRUFFLE_DEPLOYMENT_KEY (MetaMask Wallet Key without 0x appended in front) 
HUGGINGFACE_API_KEY 
AUTH_SECRET
```
4. Run ```nodemon``` in backend.
5. Run ```npm start``` in frontend.
6. Connect your wallet.
7. Go Crazy!

***

#### Screenshots
![image](https://github.com/user-attachments/assets/fdd91f4b-c195-46d2-b233-0083f1f3f099)

![image](https://github.com/user-attachments/assets/074b4789-17db-44eb-8c25-ffc44e4c8db7)

![image](https://github.com/user-attachments/assets/5ec5a465-d12e-43c1-9368-596d04e1382f)

