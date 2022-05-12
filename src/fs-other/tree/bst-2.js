/**================================== BST，二叉搜索树的构建 **/
// 访问器

class Tree {
  constructor(compare) {
    this.root = null;
    this.compare = compare || this.compare;
  }

  add(element) {
    const insertNode = new PNode(element);
    if (!this.root) {
      return (this.root = insertNode);
    }

    let currentNode = this.root;
    let parent = null;

    // 此循环是为了得到要在哪个 parent 插入新节点
    // todo: 你会发现每一次插入一个元素，都是从根遍历的，这块能优化吗？
    while (currentNode) {
      parent = currentNode; // 记住父, 最终要的是 parent
      if (this.compare(element, currentNode.element) > 0) {
        // 新插入元素大
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }

    // 此时已经拿到了 parent，判断新元素应该插入到 parent 的左侧还是右侧
    if (this.compare(element, parent.element) > 0) {
      parent.right = insertNode;
    } else {
      parent.left = insertNode;
    }

    return insertNode;
  }

  // BFS，栈 + 指针
  levelTraverse1() {
    const stack = [this.root];
    let pos = 0;
    let current;

    while ((current = stack[pos])) {
      console.log(current.element);

      if (current.left) {
        stack.push(current.left);
      }
      if (current.right) {
        stack.push(current.right);
      }

      pos++;
    }
  }

  // BFS，队列实现
  levelTraverse2() {
    const queue = [this.root];
    let current;

    while (queue.length) {
      current = queue.shift();
      console.log(current.element);

      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    }
  }

  levelTraverse(obj) {
    const stack = [this.root];
    let pos = 0;
    let current;

    while ((current = stack[pos])) {
      obj.visitor(current); // 访问器

      if (current.left) {
        stack.push(current.left);
      }
      if (current.right) {
        stack.push(current.right);
      }

      pos++;
    }
  }

  reverseTree() {
    let stack = [this.root];
    let pointer = 0;
    let current;
    while ((current = stack[pointer])) {
      console.log(current.element);

      let temp = current.left; // 将左边和右边进行一个反转
      current.left = current.right;
      current.right = temp;

      if (current.left) {
        stack.push(current.left);
      }
      if (current.right) {
        stack.push(current.right);
      }

      pointer++;
    }
  }

  compare(a, b) {
    return a - b;
  }
}

class PNode {
  constructor(element) {
    this.element = element;
    this.left = null;
    this.right = null;
  }
}

const bst = new Tree();

// [80, 200, 40, 300, 200, 5].forEach((v) => bst.add(v));

[2, 1, 3].forEach(bst.add.bind(bst)); // 注意

// bst.reverseTree();
// bst.levelTraverse1();

// babel 遍历语法树的时候  babel.transform
// htmlparser
bst.levelTraverse({
  visitor(node) {
    console.log(node.element, "my");
  },
}); // 树在前端中最常用的操作就是

console.log(bst.root);
