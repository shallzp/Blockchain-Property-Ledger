const PropertyRegistry = artifacts.require("PropertyRegistry");
const PropertyLedger = artifacts.require("PropertyLedger");
const UserRegistry = artifacts.require("UserRegistry");

contract("PropertyRegistry", (accounts) => {
  let propertyRegistry;
  let propertyLedger;
  let userRegistry;
  
  const mainAdmin = accounts[0];
  const regionalAdmin = accounts[1];
  const propertyOwner = accounts[2];
  const revenueDeptEmployee = accounts[3];
  const buyer = accounts[4];
  
  const revenueDeptId = 1;
  const locationId = 101;
  const surveyNumber = 12345;
  const area = 1000; // in square feet

  before(async () => {
    // Deploy PropertyRegistry
    propertyRegistry = await PropertyRegistry.new({ from: mainAdmin });
    
    // Deploy UserRegistry with user profiles and initial regional admin
    userRegistry = await UserRegistry.new(
      {
        firstName: "Shalini",
        lastName: "Patel",
        dateOfBirth: "2004-08-05",
        aadharNumber: "1111-2222-3333",
        resAddress: "Sudama Nagar, Indore",
        email: "shalini.patel050408@gmail.com",
        aadharFileHash: "QmQ3BnTaszRiZXC3XTo4DWf4XWJHjqXUnp6EjAGTPbBWmp"
      },
      regionalAdmin,
      {
        firstName: "Regional",
        lastName: "Admin",
        dateOfBirth: "1985-01-01",
        aadharNumber: "987654321098",
        resAddress: "456 Admin Ave",
        email: "admin@test.com",
        aadharFileHash: "QmHash456"
      },
      { from: mainAdmin }
    );

    // Get PropertyLedger address & instance
    const propertyLedgerAddress = await propertyRegistry.getPropertiesContract();
    propertyLedger = await PropertyLedger.at(propertyLedgerAddress);

    // Register and verify property owner (non-admin user)
    await userRegistry.registerUser(
      "Owner",
      "User",
      "1990-01-01",
      "123456789012",
      "123 Main St",
      "owner@test.com",
      "QmHash123",
      { from: propertyOwner }
    );
    await userRegistry.verifyUser(propertyOwner, { from: regionalAdmin });

    // Map revenue department to employee
    await propertyRegistry.mapRevenueDeptIdToEmployee(
      revenueDeptId,
      revenueDeptEmployee,
      { from: mainAdmin }
    );
  });

  describe("Contract Deployment", () => {
    it("should deploy PropertyRegistry successfully", async () => {
      assert.notEqual(propertyRegistry.address, "", "Contract address should not be empty");
      assert.notEqual(propertyRegistry.address, 0x0, "Contract address should not be zero");
    });

    it("should have PropertyLedger deployed internally", async () => {
      const ledgerAddress = await propertyRegistry.getPropertiesContract();
      assert.notEqual(ledgerAddress, "", "PropertyLedger address should not be empty");
      assert.notEqual(ledgerAddress, 0x0, "PropertyLedger address should not be zero");
    });

    it("should map revenue department to employee correctly", async () => {
      const mappedEmployee = await propertyRegistry.revenueDeptIdToEmployee(revenueDeptId);
      assert.equal(mappedEmployee, revenueDeptEmployee, "Revenue dept employee mapping incorrect");
    });
  });

  describe("Adding Land Properties", () => {
    let propertyId;

    it("should allow property owner to add a new land", async () => {
      const result = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        surveyNumber,
        area,
        { from: propertyOwner }
      );

      assert.equal(result.logs.length, 1, "Should emit one event");
      assert.equal(result.logs[0].event, "LandAdded", "Should emit LandAdded event");

      propertyId = parseInt(result.logs[0].args.propertyId);
      assert.isAbove(propertyId, 0, "Property ID should be greater than 0");
    });

    it("should store land details correctly", async () => {
      const land = await propertyRegistry.getPropertyDetails(1);

      assert.equal(parseInt(land.propertyId), 1, "Property ID mismatch");
      assert.equal(land.owner, propertyOwner, "Owner address mismatch");
      assert.equal(parseInt(land.locationId), locationId, "Location ID mismatch");
      assert.equal(parseInt(land.surveyNumber), surveyNumber, "Survey number mismatch");
      assert.equal(parseInt(land.area), area, "Area mismatch");
      assert.equal(parseInt(land.revenueDepartmentId), revenueDeptId, "Revenue dept ID mismatch");
      assert.equal(parseInt(land.state), 0, "State should be Registered (0)");
    });

    it("should add property to owner's property list", async () => {
      const ownerProperties = await propertyRegistry.getPropertiesOfOwner(propertyOwner);

      assert.equal(ownerProperties.length, 1, "Owner should have 1 property");
      assert.equal(parseInt(ownerProperties[0].propertyId), 1, "Property ID should be 1");
    });

    it("should add property to revenue department list", async () => {
      const deptProperties = await propertyRegistry.getPropertiesByRevenueDeptId(revenueDeptId);

      assert.equal(deptProperties.length, 1, "Revenue dept should have 1 property");
      assert.equal(parseInt(deptProperties[0].propertyId), 1, "Property ID should be 1");
    });

    it("should allow adding multiple properties", async () => {
      await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        67890,
        2000,
        { from: propertyOwner }
      );

      const ownerProperties = await propertyRegistry.getPropertiesOfOwner(propertyOwner);
      assert.equal(ownerProperties.length, 2, "Owner should have 2 properties");
    });
  });

  describe("Property Verification", () => {
    let propertyId;

    before(async () => {
      const result = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        11111,
        1500,
        { from: propertyOwner }
      );
      propertyId = parseInt(result.logs[0].args.propertyId);
    });

    it("should allow revenue dept employee to verify property", async () => {
      await propertyRegistry.verifyProperty(propertyId, { from: revenueDeptEmployee });
  
      const land = await propertyRegistry.getPropertyDetails(propertyId);
      assert.equal(parseInt(land.state), 1, "State should be Verified (1)");
      assert.equal(land.admin, revenueDeptEmployee, "Admin should be revenue dept employee");
    });

    it("should not allow non-employee to verify property", async () => {
      const newPropertyResult = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        22222,
        1500,
        { from: propertyOwner }
      );
      const newPropertyId = parseInt(newPropertyResult.logs[0].args.propertyId);

      try {
        await propertyRegistry.verifyProperty(newPropertyId, { from: accounts[5] });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(
          error.message,
          "Only the revenue department employee can call this function",
          "Wrong error message"
        );
      }
    });
  });

  describe("Property Rejection", () => {
    let propertyId;

    before(async () => {
      const result = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        33333,
        1200,
        { from: propertyOwner }
      );
      propertyId = parseInt(result.logs[0].args.propertyId);
    });

    it("should allow revenue dept employee to reject property", async () => {
      await propertyRegistry.verifyProperty(propertyId, { from: revenueDeptEmployee });

      const land = await propertyRegistry.getPropertyDetails(propertyId);
      assert.equal(parseInt(land.state), 1, "State should be Verified after verification");
    });

    it("should not allow non-employee to reject property", async () => {
      const newPropertyResult = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        44444,
        1200,
        { from: propertyOwner }
      );
      const newPropertyId = parseInt(newPropertyResult.logs[0].args.propertyId);

      try {
        await propertyRegistry.rejectProperty(newPropertyId, { from: buyer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(
          error.message,
          "Only the revenue department employee can call this function",
          "Wrong error message"
        );
      }
    });
  });

  describe("Ownership Transfer", () => {
    let propertyId;

    before(async () => {
      const result = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        55555,
        1800,
        { from: propertyOwner }
      );
      propertyId = parseInt(result.logs[0].args.propertyId);
      
      await propertyRegistry.verifyProperty(propertyId, { from: revenueDeptEmployee });
    });

    it("should verify property is in correct state before transfer", async () => {
      const land = await propertyRegistry.getPropertyDetails(propertyId);
      assert.equal(land.owner, propertyOwner, "Owner should be original owner before transfer");
      assert.equal(parseInt(land.state), 1, "State should be Verified");
    });
  });

  describe("Querying Properties", () => {
    it("should return empty array for owner with no properties", async () => {
      const properties = await propertyRegistry.getPropertiesOfOwner(accounts[9]);
      assert.equal(properties.length, 0, "Should return empty array");
    });

    it("should return all properties of a specific owner", async () => {
      const properties = await propertyRegistry.getPropertiesOfOwner(propertyOwner);
      assert.isAbove(properties.length, 0, "Owner should have properties");
      
      properties.forEach(property => {
        assert.equal(property.owner, propertyOwner, "All properties should belong to owner");
      });
    });

    it("should return all properties in a revenue department", async () => {
      const properties = await propertyRegistry.getPropertiesByRevenueDeptId(revenueDeptId);
      assert.isAbove(properties.length, 0, "Revenue dept should have properties");
      
      properties.forEach(property => {
        assert.equal(
          parseInt(property.revenueDepartmentId),
          revenueDeptId,
          "All properties should belong to revenue dept"
        );
      });
    });

    it("should return correct property details for valid property ID", async () => {
      const land = await propertyRegistry.getPropertyDetails(1);
      assert.equal(parseInt(land.propertyId), 1, "Should return correct property");
    });
  });

  describe("Edge Cases and Security", () => {
    it("should not allow mapping revenue dept without owner privileges", async () => {
      try {
        await propertyRegistry.mapRevenueDeptIdToEmployee(
          999,
          accounts[8],
          { from: accounts[7] }
        );
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "revert", "Should revert transaction");
      }
    });

    it("should handle zero area property", async () => {
      const result = await propertyRegistry.addLand(
        locationId,
        revenueDeptId,
        99999,
        0,
        { from: propertyOwner }
      );
      
      const propertyId = parseInt(result.logs[0].args.propertyId);
      const land = await propertyRegistry.getPropertyDetails(propertyId);
      assert.equal(parseInt(land.area), 0, "Should accept zero area");
    });
  });
});