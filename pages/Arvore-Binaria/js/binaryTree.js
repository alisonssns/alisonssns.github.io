class BinaryTree {
    constructor() {
        this.rootNode = null;
    }

    insert(value) {
        const newNode = new TreeNode(value);
        if (!this.rootNode) {
            this.rootNode = newNode;
            this.rootNode.level = 1;
            return newNode;
        }
        return this.insertNode(this.rootNode, newNode);
    }

    insertNode(currentNode, newNode) {
        newNode.level = currentNode.level + 1;
        newNode.parentNode = currentNode;

        if (newNode.value < currentNode.value) {
            if (!currentNode.leftChild) {
                currentNode.leftChild = newNode;
                return newNode;
            }
            return this.insertNode(currentNode.leftChild, newNode);
        } else {
            if (!currentNode.rightChild) {
                currentNode.rightChild = newNode;
                return newNode;
            }
            return this.insertNode(currentNode.rightChild, newNode);
        }
    }

    check(level, collisionNodes, node = this.rootNode) {
        if (node) {
            this.check(level, collisionNodes, node.leftChild);
            this.check(level, collisionNodes, node.rightChild);

            if (node.level === level) {
                collisionNodes.push(node);
            }
        }
    }

    print(node = this.rootNode) {
        let color = "#f1fd85";
        if (node) {
            highlight(node, color);
            setTimeout(() => {
                this.print(node.leftChild);
                this.print(node.rightChild);
                hide(node);
            }, 500);
        }
    }

    checkAll(node = this.rootNode) {
        if(node){
         check(node)
         this.checkAll(node.rightChild)  
         this.checkAll(node.leftChild)  
        }
    }

    findCommonAncestor(node1, node2) {
        const visitedNodes = new Set();

        while (node1 || node2) {
            if (node1) {
                if (visitedNodes.has(node1)) return node1;
                visitedNodes.add(node1);
                node1 = node1.parentNode;
            }
            if (node2) {
                if (visitedNodes.has(node2)) return node2;
                visitedNodes.add(node2);
                node2 = node2.parentNode;
            }
        }
        return null;
    }

    adjustSubtreeSpacing(node) {
        if (!node) return;
        const value = 40;
        if (node.leftChild) {
            this.adjustElement(node.leftChild, -value);
        }

        if (node.rightChild) {
            this.adjustElement(node.rightChild, value);
        }
    }

    adjustElement(node, value) {
        if (!node) return;

        const queue = [node];
        while (queue.length) {
            const currentNode = queue.shift();
            const element = document.querySelector(`#ID${currentNode.id}`);
            if (element) {
                element.style.left = `${parseInt(element.style.left || 0) + value}px`;
            }
            if (currentNode.leftChild) queue.push(currentNode.leftChild);
            if (currentNode.rightChild) queue.push(currentNode.rightChild);
        }
    }

    updateLines(node = this.rootNode) {
        if (!node) return;
        if (node.parentNode) this.traceLine(node, node.parentNode);
        this.updateLines(node.leftChild);
        this.updateLines(node.rightChild);
    }

    traceLine(node1, node2) {
        const node1Element = document.querySelector(`#ID${node1.id}`);
        const node2Element = document.querySelector(`#ID${node2.id}`);
        let line = document.querySelector(`#LINE${node1.id}`);

        const x1 = node1Element.offsetLeft + node1Element.offsetWidth / 2;
        const y1 = node1Element.offsetTop + node1Element.offsetHeight / 2;
        const x2 = node2Element.offsetLeft + node2Element.offsetWidth / 2;
        const y2 = node2Element.offsetTop + node2Element.offsetHeight / 2;

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

        if (!line) {
            line = document.createElement("div");
            line.className = "line";
            line.id = `LINE${node1.id}`;
            binaryTreeContainer.appendChild(line);
        }

        line.style.width = `${distance}px`;
        line.style.top = `${y1}px`;
        line.style.left = `${x1}px`;
        line.style.transform = `rotate(${angle}deg)`;
    }

    getSize(node = this.rootNode) {
        if (!node) {
            return 0;
        }
        const leftSize = this.getSize(node.leftChild);
        const rightSize = this.getSize(node.rightChild);
        return 1 + leftSize + rightSize;
    }

    getHeight(node = this.rootNode) {
        if (!node) {
            return 0;
        }

        const leftHeight = this.getHeight(node.leftChild);
        const rightHeight = this.getHeight(node.rightChild);
        if (rightHeight > leftHeight) {
            return rightHeight + 1
        }
        return leftHeight + 1
    }

    nodeHeight(node, currentNode = this.rootNode) {
        if (!currentNode) {
            return -1;  
        }
    
        if (currentNode === node) {
            return 1;
        }
    
        const leftHeight = this.nodeHeight(node, currentNode.leftChild);
        if (leftHeight >= 0) {
            return leftHeight + 1;  
        }
    
        const rightHeight = this.nodeHeight(node, currentNode.rightChild);
        if (rightHeight >= 0) {
            return rightHeight + 1;  
        }
    
        return -1;  
    }
    
}
