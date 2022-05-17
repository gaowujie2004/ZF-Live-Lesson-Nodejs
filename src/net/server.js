const net = require('net');

// on conncon
const server = net.createServer(function (socket) {
  console.log('有新的链接--');

  socket.on('data', function (data) {
    // 客户端和服务端
    // socket.write('hi'); // 服务端和客户端说 hi
    console.log('Server 接收', data);

    // setTimeout(() => {

    // })
  });

  socket.on('end', function () {
    console.log('客户端关闭');
  });
});

server.on('error', function (err) {
  console.log(err);
});

server.listen(8080, () => {
  console.log('TCP Server 8080');
}); // 监听8080端口
