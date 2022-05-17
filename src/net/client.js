const net = require('net');
const socket = new net.Socket();
const fs = require('fs');

// 连接8080端口
socket.connect(8080, 'localhost');

// 连接成功后给服务端发送消息
socket.on('connect', function (data) {
  console.log('Client 链接成功');
  // socket.write('hello'); // 浏览器和客户端说 hello
  // socket.end();

  setTimeout(() => {
    socket.write(fs.readFileSync('./your.jpg'));
  }, 2000);
});

socket.on('data', function (data) {
  console.log('Client 收到数据---', data.toString());
});

socket.on('error', function (error) {
  console.log(error);
});
