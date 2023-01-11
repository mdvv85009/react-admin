import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import giftData from '../asset/data/get_gift_list';

axios.defaults.baseURL = 'http://localhost';

// const operations = {
//   setEndTime: 'http://localhost/',
//   addCodes: 'http://localhost',
//   createCode: 'http://localhost',
// };

function useFetchGiftCodeData() {
  const [response, setResponse] = useState(undefined);
  const [refresh, setRefresh] = useState(true);

  const fetchData = useCallback(() => {
    setResponse(giftData);
  }, []);

  useEffect(() => {
    if (refresh) {
      setResponse(undefined);
      setTimeout(() => fetchData(), 1000);
      setRefresh(false);
    }
  }, [refresh, fetchData]);
  return { data: response, refreshData: () => setRefresh(true) };
}

function useHttpRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (config, formData, setData) => {
    setIsLoading(true);
    setError(null);
    try {
      // response = await axios({
      //   url: config.url,
      //   method: config.method ? requestConfig.method : 'GET',
      //   headers: config.headers ? requestConfig.headers : {},
      //   data: formData ? requestConfig.data : null,
      // });
    } catch (error) {
      setError(error.message || 'Something went wrong!');
    } finally {
      // if (response) {
      //   setData(response.data);
      // }
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, sendRequest };
}

export { useFetchGiftCodeData, useHttpRequest };
