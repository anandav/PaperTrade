# PaperTrade
Do papertrade without losing your capital. Inspired by Sensibull, Tradingview paper trades and tastyworks.

[![Papertrade](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml/badge.svg)](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml)

## Server
Server folder contains API code and it's runs on port 9090. To start API use "npm run dev" in server folder.

## Client 
Client folder contains SPA code and it's runs on port 8080. To start App use "npm run dev" in client folder.

## Backend 
Webapi uses Mongodb Atlas, change the connectionstring in .env file to point to your mongodb instance (not tested in local instances).
 
 ## Build 
 Client build (npm run build) will build app and move the dist to '/server/public' folder.

> :warning: Authentication and Authorization in not implemeted, will implement SAML/OAuth  in futurechit .

> :warning: Delete functionality won't ask for conformation.

 

