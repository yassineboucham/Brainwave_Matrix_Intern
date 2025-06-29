// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public owner;
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function vote(uint index) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(index < candidates.length, "Bad index");
        hasVoted[msg.sender] = true;
        candidates[index].voteCount += 1;
    }

    function getCandidate(uint index) external view returns (string memory, uint) {
        require(index < candidates.length, "Bad index");
        Candidate memory c = candidates[index];
        return (c.name, c.voteCount);
    }

    function totalCandidates() external view returns (uint) {
        return candidates.length;
    }
}
