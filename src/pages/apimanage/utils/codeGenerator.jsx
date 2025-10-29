// 샘플 코드 생성
const generateSampleCode = (endpoint, params) => {
  return `// JavaScript fetch 예제
const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 4)})
});

const data = await response.json();
console.log(data);

// curl 예제
/*
curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${JSON.stringify(params)}'
*/`;
};

// Python 샘플 코드 생성
const generatePythonCode = (endpoint, params) => {
  return `# Python requests 예제
import requests
import json

url = "${endpoint}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = ${JSON.stringify(params, null, 4)}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`;
};

// cURL 명령어 생성
const generateCurlCommand = (endpoint, params) => {
  return `curl -X POST "${endpoint}" \\
  -H "Content-Type: "application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${JSON.stringify(params)}'`;
};

// Default export
export default {
  generateSampleCode,
  generatePythonCode,
  generateCurlCommand
};