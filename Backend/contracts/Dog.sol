// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleAuction {
    address public owner;
    address public highestBidder;
    uint256 public highestBid;
    bool public ended;
    
    mapping(address => uint256) public bids;
    
    event NewBid(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    modifier onlyNotEnded() {
        require(!ended, "Auction has ended");
        _;
    }
    
    function placeBid() public payable onlyNotEnded {
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");
        
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }
        
        highestBidder = msg.sender;
        highestBid = msg.value;
        
        emit NewBid(msg.sender, msg.value);
    }
    
    function endAuction() public onlyOwner onlyNotEnded {
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        payable(owner).transfer(highestBid);
    }
}
