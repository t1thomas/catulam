import Vue from 'vue';
import axios from 'axios';

const serverConn = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:9000', // the url of our server
});

Vue.$axios = serverConn;

Object.defineProperty(Vue.prototype, '$axios', {
  get() {
    return serverConn;
  },
});
