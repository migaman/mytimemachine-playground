pragma solidity ^0.4.24;

contract VideoContract {

    //adresss of the contract creator.
    address public contractCreatorAddress;

    // Represent a single vieo
    struct Video {
        uint id;
        bytes32 secretKey;
        bytes32 secretKeyPlain;
        uint releasedatetime; //release date of the video
        uint64 releaseBlock; //release Block of the video
        uint value;
        address authorAddress; //address of video uploader
        string ipfsHash; //link to the video file
    }

    uint numVideos = 0;

    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;

    // hash tables  (every possible key exists and is mapped to a value whose byte-representation is all zeros.)
    //mapping(address => Video[]) public videos;
    //mapping(uint => Video[]) public videos;
    Video[] public videos;

    uint[] public videoIds;

    // Constructor (code runs only when the contract is created)
    constructor() public {
        //msg.address = where the current (external) function call came from
        contractCreatorAddress = msg.sender;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == contractCreatorAddress, "Only the owner of the contract can call this method");
        // Do not forget the "_;"! It will be replaced by the actual function body when the modifier is used.
        _;
    }


	//msg.value contains the ether
    function addVideo(uint _id, bytes32 _secretKey, uint _releasedatetime, string _ipfsHash) public payable returns (bool videoAccepted){
        //Accept only payments higher than one other
        if(msg.value >= 0.001 ether) {
            
            // Compute an estimation of the release time in blocks
            uint64 releaseEndBlock = uint64((5 minutes / secondsPerBlock) + block.number);

            if(numVideos == videos.length) {
                videos.length += 1;
            }
            videos[numVideos++] = Video({
                id: _id,
                secretKey: _secretKey,
                secretKeyPlain: "",
                releasedatetime: _releasedatetime,
                value: msg.value,
                authorAddress: msg.sender,
                releaseBlock: releaseEndBlock,
                ipfsHash: _ipfsHash
            });
            videoIds.push(_id);
            
            return true;    
           
        }
        else {
            //Not enough ether --> revert
            revert("not sufficient ether");
            return false;
        }

    }

    function getVideoAttributes(uint _id) public view returns (uint, bytes32, uint, uint64, uint, address, bool, string) {
        Video memory video = getVideo(_id);
        bool isAvailable = isVideoAvailable(_id);
        return (video.id, video.secretKey, video.releasedatetime, video.releaseBlock, 
            video.value, video.authorAddress, isAvailable, video.ipfsHash);
    }


    function getVideoIds() public view returns (uint[]) {
        return videoIds;
    }

    
  
    //write secretkey in plaintext to blockchain
    function releaseVideo(uint _id, bytes32 _secretKeyword) public {
        for (uint i = 0; i < videos.length; i++) {
            if (videos[i].id == _id) {
                Video storage video = videos[i];
                if(block.number > video.releaseBlock) {
                    if (video.secretKey == keccak256(abi.encodePacked(msg.sender, _secretKeyword))) {
                        video.secretKeyPlain = _secretKeyword;
                    }
                }        
            }
        }
    }


    /**************
    Admin-Functions
    ***************/
    
    function removeAllVideos()  public onlyOwner returns (bool successful)  {
        numVideos = 0;
        return true;
    }

    /**
    * Fix how many seconds per blocks are currently observed.
    */
    function setSecondsPerBlock(uint256 secs) external onlyOwner {
        secondsPerBlock = secs;
    }

    


    /**************
    private  functions
    ***************/

    function isVideoAvailable (uint _id) private view  returns(bool videoReleased) {
        Video memory video = getVideo(_id);
        
        if(block.number >= video.releaseBlock) {
            return true;
        }
        else {
            return false;
        }
    
    }

    function getVideo (uint _id) private view  returns(Video) {
        for (uint i = 0; i < videos.length; i++) {
            if (videos[i].id == _id) {
                Video memory video = videos[i];
                return video;
                break;
            }
        }
    }

    
    function getTotalVideos() public view returns(uint) {
        return numVideos;
    }
    
    function getBlockNumber () public view  returns(uint) {
        return block.number;
    }

    function getBlockTimestamp () public view  returns(uint) {
        return block.timestamp;
    }
    

  
}