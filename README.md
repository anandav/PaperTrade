# PaperTrade
Do papertrade without losing your capital. Designed for the derivative market. Inspired by Sensibull papertade, Tradingview papertrade, and tastyworks.

![PaperTrade CI](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml/badge.svg)
<!-- 
[![Papertrade](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml/badge.svg)](https://github.com/anandav/PaperTrade/actions/workflows/master_nse-papertrade-app.yml) -->

## Server
The server folder contains API code and it's runs on port 9090. To start API use "npm run dev" in the server folder.

## Client 
The client folder contains SPA code and it's runs on port 8080. To start App use "npm run dev" in the client folder.

BSD and Linux users can run "npm run dev" from the application root directory to start both Client & Server.

## Backend 
Web API uses MongoDB Atlas, change the connection string in the ".env" file to point to your MongoDB instance (not tested in local instances).

 ## Build 
 Client build (npm run build) will build the app and move the dist to the '/server/public' folder.

---
> :warning: Authentication and Authorization in not implemeted, will implement SSO(SAML/OAuth) support in future.

> :warning: Delete functionality won't ask for conformation, use 'double click' to delete.

 

