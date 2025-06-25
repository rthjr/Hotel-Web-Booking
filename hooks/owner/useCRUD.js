// hooks/useCRUD.js
'use client';

import { useState, useCallback } from 'react';
import { api } from '@lib/api';

export const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Clear error when starting new operation
  const clearError = () => setError(null);

  // Fetch all items
  const fetchAll = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      clearError();
      
      // Build query string from parameters
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      //console.log(`Fetching data from: ${url}`, response);
      
      // Handle Laravel pagination response
      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 10,
          total: response.data.total || 0,
        });
      } else if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (Array.isArray(response)) {
        setData(response);
      } else {
        setData([]);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      setData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Fetch single item
  const fetchOne = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.get(`/${endpoint}/${id}`);
      const itemData = response.data || response;
      //console.log(`Fetched item from: /${endpoint}/${id}`, itemData);
      setItem(itemData);

      //console.log("item", itemData);
      return itemData;
    } catch (err) {
      setError(err.message);
      setItem(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Create new item
  const create = useCallback(async (itemData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post(`/${endpoint}`, itemData);
      const newItem = response.data || response;
      
      // Add to local data if we have a list
      if (Array.isArray(data)) {
        setData(prevData => [...prevData, newItem]);
      }
      
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, data]);

  // Update existing item
  const update = useCallback(async (id, itemData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.put(`/${endpoint}/${id}`, itemData);
      const updatedItem = response.data || response;
      
      // Update in local data if we have a list
      if (Array.isArray(data)) {
        setData(prevData => 
          prevData.map(item => 
            item.id === id ? { ...item, ...updatedItem } : item
          )
        );
      }
      
      // Update single item if it matches
      if (item && item.id === id) {
        setItem({ ...item, ...updatedItem });
      }
      
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, data, item]);

  // Delete item
  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      
      await api.delete(`/${endpoint}/${id}`);
      
      // Remove from local data if we have a list
      if (Array.isArray(data)) {
        setData(prevData => prevData.filter(item => item.id !== id));
      }
      
      // Clear single item if it matches
      if (item && item.id === id) {
        setItem(null);
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, data, item]);

  // Batch operations
  const batchUpdate = useCallback(async (updates) => {
    try {
      setLoading(true);
      clearError();
      
      const promises = updates.map(({ id, data }) => 
        api.put(`/${endpoint}/${id}`, data)
      );
      
      const results = await Promise.all(promises);
      
      // Update local data
      if (Array.isArray(data)) {
        setData(prevData => {
          const updatedData = [...prevData];
          results.forEach((result, index) => {
            const { id } = updates[index];
            const updatedItem = result.data || result;
            const itemIndex = updatedData.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
              updatedData[itemIndex] = { ...updatedData[itemIndex], ...updatedItem };
            }
          });
          return updatedData;
        });
      }
      
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, data]);

  const batchDelete = useCallback(async (ids) => {
    try {
      setLoading(true);
      clearError();
      
      const promises = ids.map(id => api.delete(`/${endpoint}/${id}`));
      await Promise.all(promises);
      
      // Remove from local data
      if (Array.isArray(data)) {
        setData(prevData => prevData.filter(item => !ids.includes(item.id)));
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, data]);

  // Reset state
  const reset = useCallback(() => {
    setData([]);
    setItem(null);
    setError(null);
    setLoading(false);
    setPagination({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    });
  }, []);
  //console.log("data", item);
  //console.log("data" , data)

  return {
    // Data
    data,
    item,
    loading,
    error,
    pagination,
    
    // Actions
    fetchAll,
    fetchOne,
    create,
    update,
    delete: remove,
    batchUpdate,
    batchDelete,
    reset,
    clearError,
    
    // Helpers
    hasData: data.length > 0,
    isEmpty: data.length === 0,
    hasError: !!error,
  };
};