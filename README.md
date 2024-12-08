# PaperTrade
This is a simple trading simulator that allows you to test your trading strategies without putting any real money at risk. It is inspired by Sensibull papertrade, Tradingview papertrade, and tastyworks.

![PaperTrade CI](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml/badge.svg)
<!-- 
[![Papertrade](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml/badge.svg)](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml) -->

## Server
The server folder contains API code and it's runs on port 9090. To start API use `npm run dev` in the server folder.

## Client 
The client folder contains SPA code and it's runs on port 8080. To start App use `npm run dev` in the client folder.

BSD and Linux users can run `npm run dev` from the application root directory to start both Client & Server.

## Backend 
Web API uses MongoDB Atlas, change the connection string in the `.env` file to point to your MongoDB instance (not tested in local instances).

 ## Build 
 Client build (npm run build) will build the app and move the dist to the '/server/public' folder.

 ## Screenshot

 ![Screenshot](https://gitlab.com/anandav/PaperTrade/-/raw/master/Screenshot.png "Screenshot")

---
> :warning: Required nodejs 16 LTS.
> :warning: Make sure to rename `.env.sample` to `.env` files for both server and client
> :warning: chagne the endpoint in server `.env` to get live update from NSE (Unfortunatily I can't share those API urls)
> :warning: Change the endpoint in server's `.env` file to get live updates from NSE. (Unfortunately, I can't share those API URLs.)
> :warning: Delete functionality won't ask for conformation, use 'double click' to delete.

 



