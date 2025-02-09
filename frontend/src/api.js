import axios from 'axios';

const Api= axios.create({
  baseURL: 'http://localhost:5264/api',
});

export default Api;