'use strict';
const cache = require('memory-cache');
const got = require('got');
require('dotenv').config();
const { readFile } = require('fs/promises');
const path = require('path');

const CACHE_TOKEN = 'cache_token';

const qlDir = process.env.QL_DIR || '/ql';
const authFile = path.join(qlDir, 'config/auth.json');

const api = got.extend({
  prefixUrl: process.env.QL_URL || 'http://localhost:5600',
  retry: { limit: 0 },
});

async function getToken() {
  const qlId = process.env.QL_ID
  const qlSecret = process.env.QL_SECRET
  const token = cache.get(CACHE_TOKEN)
  if (token) {
    console.log(token, '走缓存了')
    return token;
  }
  const body = await api({
    url: `open/auth/token?client_id=${qlId}&client_secret=${qlSecret}`,
    headers: {
      Accept: 'application/json',
    },
  }).json();
  console.log(body);
  if (body && body.code === 200) {
    //缓存十天
    cache.put(CACHE_TOKEN, body.data.token,  24 * 60 * 60 * 10 * 1000)
    return body.data.token
  }
  throw new Error("获取授权异常！")
}

module.exports.getEnvs = async () => {
  const token = await getToken();
  const body = await api({
    url: 'open/envs',
    searchParams: {
      searchValue: 'JD_COOKIE',
      t: Date.now(),
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).json();
  return body.data;
};

module.exports.getEnvsCount = async () => {
  const data = await this.getEnvs();
  return data.length;
};

module.exports.addEnv = async (cookie, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'post',
    url: 'open/envs',
    params: { t: Date.now() },
    json: [{
      name: 'JD_COOKIE',
      value: cookie,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateEnv = async (cookie, eid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'open/envs',
    params: { t: Date.now() },
    json: {
      name: 'JD_COOKIE',
      value: cookie,
      id: eid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.delEnv = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'delete',
    url: 'open/envs',
    params: { t: Date.now() },
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

//////////////////////////////////////////////////
// wskey
module.exports.getWSCKEnvs = async () => {
  const token = await getToken();
  const body = await api({
    url: 'open/envs',
    searchParams: {
      searchValue: 'JD_WSCK',
      t: Date.now(),
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).json();
  return body.data;
};

module.exports.getWSCKEnvsCount = async () => {
  const data = await this.getWSCKEnvs();
  return data.length;
};

module.exports.addWSCKEnv = async (jdwsck, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'post',
    url: 'open/envs',
    params: { t: Date.now() },
    json: [{
      name: 'JD_WSCK',
      value: jdwsck,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateWSCKEnv = async (jdwsck, wseid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'open/envs',
    params: { t: Date.now() },
    json: {
      name: 'JD_WSCK',
      value: jdwsck,
      id: wseid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.delWSCKEnv = async (wseid) => {
  const token = await getToken();
  const body = await api({
    method: 'delete',
    url: 'open/envs',
    params: { t: Date.now() },
    body: JSON.stringify([wseid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

//////////////////////////////////////////////////
