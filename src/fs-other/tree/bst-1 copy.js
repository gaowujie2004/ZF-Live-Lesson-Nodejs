/**================================== BST，二叉搜索树的构建 **/

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
      if (element > currentNode.element) {
        // 新插入元素大
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }

    // 此时已经拿到了 parent，判断新元素应该插入到 parent 的左侧还是右侧
    if (element > parent.element) {
      parent.right = insertNode;
    } else {
      parent.left = insertNode;
    }

    return insertNode;
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

[80, 200, 40, 300, 290, 5].forEach(bst.add.bind(bst)); // 注意

console.log(bst.root);
