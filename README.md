# Blockchain Developer Bootcamp Final Project

### Certification to: qudoki.eth
## Gamified Practice of Sustainable Life (FairCarbon, SustainFare, CarbonFare, Existenfare, etc.)
Sustainability initiatives in practice are missing incentive structures, from both an individual and enterprise perspective. Future calamity is not enough to convince all people and organizations around the world to be a part of a unified solution. This dApp aims to gamify the practice of Sustainable Living with the tracking of an impact point system, defined mathematically by one's environmental footprint in three categories - carbon, water, and waste (potentially eventually tied to actual meter or IoT device readings). Tokens could be mined by consistent user interaction and low metrics performed by the individual (would need to de-incentivize overmining). At the enterprise level, companies could buy in, thereby establishing social presence and participation on the platform, and offer discounts to individuals that could be exchanged for tokens, effectively "buying" good behavior in exchange for social acceptance and engagement.
#### Logic:
1. Similar to a weight loss app functionality, users would log their footprint on a daily basis. Interactions can be off-chain until the end of a set time period (24 hours, potentially 30-day to avoid daily gas fees - hopefully nominal at the start as its only transacting data). Potentially would not see their rewards until nodes can validate the averages? What do miners receive? Could there be enterprise "sponsorships" for nodes?

globalState would hold averages of all users, updated consistently, and potentially tied to global carbon emission averages.

function userCommitData (carbon, water, waste) public {

}

Think of how to disincentivize false data, ensure accurate reporting, avoid overmining (who is mining? can you distinguish between mined coins and earned coins?)

2. Consistency and lower metrics compared to the average activity per person are rewarded with tokens.

function compareInput (carbon, water, waste) public {
    if userCommitData < averageUserData {
        reward msg.sender;
    }
}

3. Users could trade tokens for a discount or exclusive access to sale. OR users could earn exclusivity to NFT. Achievement levels + front end rewards logging profile.

function tradeTokens () {
    return someIPFSValue
    or
    discountCode
}

4. The more tokens a company holds, users intuitively understand the higher commitment they have to sustainable practice.

If enterprise involvement, display back company commitments by comparison.

## Below is under :construction:!

### Deployment & Repository
:construction:
- [Github Repository Link](https://github.com/qudoki/blockchain-developer-bootcamp-final-project)

### Technical Requirements
:construction:
<!-- * Javascript
* React.js
* JSX
* Express/Node.js
* MongoDB/Mongoose
* Node.js/Express
* Bootstrap
* Various NPM packages
* HTML5/CSS -->
  
### Description: 
:construction:

# Table of Contents
- [Installation](https://github.com/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#installation)
- [Usage](https://github.com/qudoki/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#usage)
- [Screenshots](https://github.com/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#screenshots)
- [Tests](https://github.com/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#usage)
- [Contributing](https://github.com/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#contributions)
- [Questions](https://github.com/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#questions)
- [License](https://github.com/qudoki/blockchain-developer-bootcamp-final-project/blob/main/README.md#license)

## Installation:
:construction:

## Usage:
:construction:

## Screenshots:
:construction:
<!-- ![ScreenShot](./client/public/new.png) -->

## Contributing:
- In most cases, please refer to this document: [Contributor Covenant](https://www.contributor-covenant.org/) 
- Please contact Quinn Dong-Kilkenny (qudoki) for collaboration.
- Please contact the owner.

## Questions:
- [Github Profile](https://github.com/qudoki)
- [Email Me](mailto:qdong327@gmail.com)

## License: 
MIT
[License](https://img.shields.io/badge/license-MIT-green")

    Copyright 2021 Quinn Dong-Kilkenny 

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.