import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const latency = new Trend('request_duration');

export const options = {
  stages: [
    { duration: '30s', target: 50 },  
    { duration: '1m', target: 100 },  
    { duration: '2m', target: 100 },   
    { duration: '30s', target: 0 }, 
  ],
  thresholds: {
    errors: ['rate<0.02'],                    
    http_req_duration: ['p(95)<1500'],        
  },
};

const BASE_URL = 'http://localhost:8000';
const QUERIES = [
  'contract', 'data', 'employment', 'law', 'security',
  'intellectual property', 'consumer', 'environment',
  'governance', 'money laundering', 'privacy', 'license',
];

export default function () {
  const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];

  const payload = JSON.stringify({ query });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/generate`, payload, params);

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'has matched_docs': (r) => {
      try {
        return JSON.parse(r.body).data?.matched_docs !== undefined;
      } catch { return false; }
    },
  });

  errorRate.add(!ok);
  latency.add(res.timings.duration);

  sleep(1);
}