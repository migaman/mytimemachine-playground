const VideoContract = artifacts.require("./VideoContract.sol")

const timePeriodInSeconds = 3600;
const from = Math.floor(new Date() / 1000);
const to = from + timePeriodInSeconds;
const numVideos = 2;

contract('VideoContract', async (accounts) => {
  const owner = accounts[0];

  let instance
  beforeEach('setup contract for each test', async () => {
    instance = await VideoContract.new();
  })

  it('Owner is Deployer', async () => {
    const currentOwner = await instance.contractCreatorAddress()
    assert.equal(currentOwner, owner)
  })


})