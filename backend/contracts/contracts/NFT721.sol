// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; // Import the Counters library

contract OmniwinNFT721 is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter; // A counter for tracking token IDs

    // Base URI for computing {tokenURI}
    string private _baseURIextended;

    constructor() ERC721("NonFunToken", "NONFUN") {}

    // Function to set the base URI
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    // Override the _baseURI function to provide the correct base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    // Allows minting of a new NFT with auto-incremented tokenId
    function mintCollectionNFT(address collector) public onlyOwner {
        _safeMint(collector, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    // Optional: Retrieve the current tokenId (useful for external references)
    function currentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
