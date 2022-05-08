function getUserName() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('gaowujie');
    }, 2000);
  });
}
