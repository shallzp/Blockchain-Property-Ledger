import { useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';

export const usePropertyRegistry = () => {
  const { contracts, currentAccount, web3 } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add new land
  const addLand = useCallback(async (landData) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyRegistry.methods
        .addLand(
          landData.locationId,
          landData.revenueDepartmentId,
          landData.surveyNumber,
          landData.area
        )
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to add land';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, currentAccount]);


  // Get property details
  const getPropertyDetails = useCallback(async (propertyId) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    try {
      const property = await contracts.propertyRegistry.methods
        .getPropertyDetails(propertyId)
        .call();

      return {
        propertyId: parseInt(property.propertyId),
        owner: property.owner,
        admin: property.admin,
        revenueDepartmentId: parseInt(property.revenueDepartmentId),
        locationId: parseInt(property.locationId),
        surveyNumber: parseInt(property.surveyNumber),
        index: parseInt(property.index),
        area: parseInt(property.area),
        marketValue: web3.utils.fromWei(property.marketValue.toString(), 'ether'),
        noOfRequests: parseInt(property.noOfRequests),
        state: parseInt(property.state),
      };
    } catch (err) {
      const errorMsg = err.message || 'Failed to get property details';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, web3]);


  // Get all properties of owner
  const getPropertiesOfOwner = useCallback(async (ownerAddress) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    try {
      const targetAddress = ownerAddress || currentAccount;
      const properties = await contracts.propertyRegistry.methods
        .getPropertiesOfOwner(targetAddress)
        .call();

      return properties.map((prop) => ({
        propertyId: parseInt(prop.propertyId),
        owner: prop.owner,
        admin: prop.admin,
        revenueDepartmentId: parseInt(prop.revenueDepartmentId),
        locationId: parseInt(prop.locationId),
        surveyNumber: parseInt(prop.surveyNumber),
        index: parseInt(prop.index),
        area: parseInt(prop.area),
        marketValue: web3.utils.fromWei(prop.marketValue.toString(), 'ether'),
        noOfRequests: parseInt(prop.noOfRequests),
        state: parseInt(prop.state),
      }));
    } catch (err) {
      const errorMsg = err.message || 'Failed to get properties';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, currentAccount, web3]);


  // Get properties by revenue department
  const getPropertiesByRevenueDept = useCallback(async (revenueDeptId) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    try {
      const properties = await contracts.propertyRegistry.methods
        .getPropertiesByRevenueDeptId(revenueDeptId)
        .call();

      return properties.map((prop) => ({
        propertyId: parseInt(prop.propertyId),
        owner: prop.owner,
        admin: prop.admin,
        revenueDepartmentId: parseInt(prop.revenueDepartmentId),
        locationId: parseInt(prop.locationId),
        surveyNumber: parseInt(prop.surveyNumber),
        index: parseInt(prop.index),
        area: parseInt(prop.area),
        marketValue: web3.utils.fromWei(prop.marketValue.toString(), 'ether'),
        noOfRequests: parseInt(prop.noOfRequests),
        state: parseInt(prop.state),
      }));
    } catch (err) {
      const errorMsg = err.message || 'Failed to get department properties';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, web3]);


  // Verify property (Revenue Dept Employee only)
  const verifyPropertyRegistration = useCallback(async (propertyId) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyRegistry.methods
        .verifyProperty(propertyId)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to verify property';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, currentAccount]);

  // Reject property (Revenue Dept Employee only)
  const rejectPropertyRegistration = useCallback(async (propertyId) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyRegistry.methods
        .rejectProperty(propertyId)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to reject property';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, currentAccount]);



  // Map revenue department to employee
  const mapRevenueDeptToEmployee = useCallback(async (revenueDeptId, employeeAddress) => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyRegistry.methods
        .mapRevenueDeptIdToEmployee(revenueDeptId, employeeAddress)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to map revenue department';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, currentAccount]);

  // Get employee by revenue department
  const getEmployeeByRevenueDept = useCallback(async (revenueDeptId) => {
    if (!contracts.propertyRegistry) {
      throw new Error("PropertyRegistry contract not loaded");
    }
    try {
      const employeeAddress = await contracts.propertyRegistry.methods
        .getEmployeeByRevenueDept(revenueDeptId)
        .call();
      return employeeAddress;
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch employee by revenue dept";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry]);



  // Get all properties
  const getAllProperties = useCallback(async () => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    try {
      const properties = await contracts.propertyRegistry.methods
        .getAllProperties()
        .call();

      return properties.map((prop) => ({
        propertyId: parseInt(prop.propertyId),
        owner: prop.owner,
        admin: prop.admin,
        revenueDepartmentId: parseInt(prop.revenueDepartmentId),
        locationId: parseInt(prop.locationId),
        surveyNumber: parseInt(prop.surveyNumber),
        index: parseInt(prop.index),
        area: parseInt(prop.area),
        marketValue: web3.utils.fromWei(prop.marketValue.toString(), 'ether'),
        noOfRequests: parseInt(prop.noOfRequests),
        state: parseInt(prop.state),
      }));
    } catch (err) {
      const errorMsg = err.message || 'Failed to get all properties';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, web3]);

  // Get pending properties for verification
  const getPendingPropertiesForVerification = useCallback(async () => {
    if(!contracts.propertyRegistry) {
      throw new Error("PropertyRegistry contract not loaded");
    }

    try {
      const properties = await contracts.propertyRegistry.methods
        .getPendingPropertiesForVerification()
        .call();

      // If properties are just IDs, you may want to fetch details for each:
      // Example: 
      // return await Promise.all(properties.map(id => getPropertyDetails(id)));

      return properties; // adapt as needed
    } catch (err) {
      const errorMsg = err.message || "Failed to get pending properties";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry]);

  // Get all verified properties
  const getVerifiedProperties = useCallback(async () => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    try {
      const properties = await contracts.propertyRegistry.methods
        .getVerifiedProperties()
        .call();

      // Map raw contract properties to JS objects, assuming same structure as others
      return properties.map((prop) => ({
        propertyId: parseInt(prop.propertyId),
        owner: prop.owner,
        admin: prop.admin,
        revenueDepartmentId: parseInt(prop.revenueDepartmentId),
        locationId: parseInt(prop.locationId),
        surveyNumber: parseInt(prop.surveyNumber),
        index: parseInt(prop.index),
        area: parseInt(prop.area),
        marketValue: web3.utils.fromWei(prop.marketValue.toString(), 'ether'),
        noOfRequests: parseInt(prop.noOfRequests),
        state: parseInt(prop.state),
      }));
    } catch (err) {
      const errorMsg = err.message || 'Failed to get verified properties';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, web3]);

  // Get on sale properties
  const getOnSaleProperties = useCallback(async () => {
    if (!contracts.propertyRegistry) {
      throw new Error('PropertyRegistry contract not loaded');
    }

    try {
      const properties = await contracts.propertyRegistry.methods
        .getOnSaleProperties()
        .call();

      return properties.map((prop) => ({
        propertyId: parseInt(prop.propertyId),
        owner: prop.owner,
        admin: prop.admin,
        revenueDepartmentId: parseInt(prop.revenueDepartmentId),
        locationId: parseInt(prop.locationId),
        surveyNumber: parseInt(prop.surveyNumber),
        index: parseInt(prop.index),
        area: parseInt(prop.area),
        marketValue: web3.utils.fromWei(prop.marketValue.toString(), 'ether'),
        noOfRequests: parseInt(prop.noOfRequests),
        state: parseInt(prop.state),
      }));
    } catch (err) {
      const errorMsg = err.message || 'Failed to get on sale properties';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyRegistry, web3]);


  return {
    addLand,
    getPropertyDetails,
    getPropertiesOfOwner,
    getPropertiesByRevenueDept,
    verifyPropertyRegistration,
    rejectPropertyRegistration,
    mapRevenueDeptToEmployee,
    getEmployeeByRevenueDept,
    getAllProperties,
    getPendingPropertiesForVerification,
    getVerifiedProperties,
    getOnSaleProperties,
    loading,
    error,
  };
};
