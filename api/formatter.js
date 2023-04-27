require("dotenv").config();
const axios = require("axios");

module.exports = async (req, res) => {
  switch (req.method) {
    case "POST":
      try {
        const ens = req.body.ens;
        let data = JSON.stringify({
          "query": "query WalletTokens($ensName:String!){wallet(ensName:$ensName){tokens{edges{node{tokenId...on ERC721Token{ contract {address} images{url width height mimeType}}}}}}}",
          "variables": {
            "ensName": ens
          }
        });

        let config = {
            headers: { 
              'x-api-key': process.env.APIKEY, 
              'Content-Type': 'application/json'
            }
        };

        let response = await axios.post(
          "https://graphql.icy.tools/graphql",
          data,
          config
        );
        let array=[];

        for (let i = 0; i < response.data.data.wallet.tokens.edges.length; i++) {
          let {tokenId}=response.data.data.wallet.tokens.edges[i].node;
          let {address}=response.data.data.wallet.tokens.edges[i].node.contract;
          let images= response.data.data.wallet.tokens.edges[i].node.images?response.data.data.wallet.tokens.edges[i].node.images:[];
          array.push({tokenId:tokenId,address:address,images:images});
        
        }   
        res.status(200).json(array);

      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

      break;

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
};
