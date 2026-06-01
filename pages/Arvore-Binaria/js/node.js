let nodeId = 0;

class TreeNode {
    constructor(value) {
        this.value = value;
        this.id = ++nodeId;
        this.level = null;
        this.leftChild = null;
        this.rightChild = null;
        this.parentNode = null;
    }
}
