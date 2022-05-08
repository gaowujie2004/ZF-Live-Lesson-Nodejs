const fs = require('fs/promises');
const path = require('path');

async function read() {
  let name = await fs.readFile(path.join(__dirname, './file/name'), 'utf-8');
  let userInfo = await fs.readFile(path.join(__dirname, './file', name), 'utf-8');
  // xxxx();
  let ret = await `${name} -- ${userInfo}`;

  // console.log('用户信息--', userInfo);
  return ret;
}

// 直接调用即可，不需要 co 模块
read().then().catch();
