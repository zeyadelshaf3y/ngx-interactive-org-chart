import { OrgChartNode } from '../models';

/**
 * Moves a node from its current position to become a child of a target node.
 * This is a pure function that returns a new tree structure without modifying the original.
 *
 * @param rootNode - The root node of the tree
 * @param draggedNodeId - The ID of the node to move
 * @param targetNodeId - The ID of the node that will become the parent
 * @returns A new tree structure with the node moved, or null if the operation fails
 *
 * @example
 * ```typescript
 * const updatedTree = moveNode(currentTree, '5', '3');
 * if (updatedTree) {
 *   this.data.set(updatedTree);
 * }
 * ```
 */
export function moveNode<T>(
  rootNode: OrgChartNode<T>,
  draggedNodeId: string | number,
  targetNodeId: string | number
): OrgChartNode<T> | null {
  // First, find and extract the dragged node
  const draggedNode = findNode(rootNode, draggedNodeId);
  if (!draggedNode) {
    return null;
  }

  // Check if target is a descendant of dragged node (prevent circular references)
  if (isNodeDescendant(draggedNode, targetNodeId)) {
    return null;
  }

  // Remove the dragged node from its current position
  const treeWithoutNode = removeNode(rootNode, draggedNodeId);

  if (!treeWithoutNode) {
    return null;
  }

  // Add the dragged node to the target node's children
  const finalTree = addNodeToParent(treeWithoutNode, targetNodeId, draggedNode);

  return finalTree;
}

/**
 * Finds a node in the tree by its ID.
 *
 * @param node - The node to search in
 * @param nodeId - The ID of the node to find
 * @returns The found node or null
 */
export function findNode<T>(
  node: OrgChartNode<T>,
  nodeId: string | number
): OrgChartNode<T> | null {
  if (node.id === nodeId) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child as OrgChartNode<T>, nodeId);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Checks if a node is a descendant of another node.
 *
 * @param node - The potential ancestor node
 * @param descendantId - The ID of the potential descendant
 * @returns true if the node with descendantId is a descendant of node
 */
export function isNodeDescendant<T>(
  node: OrgChartNode<T>,
  descendantId: string | number
): boolean {
  if (node.id === descendantId) {
    return true;
  }

  if (!node.children?.length) {
    return false;
  }

  return node.children.some(child =>
    isNodeDescendant(child as OrgChartNode<T>, descendantId)
  );
}

/**
 * Removes a node from the tree structure.
 * Returns a new tree without the specified node.
 *
 * @param node - The root node to search in
 * @param nodeIdToRemove - The ID of the node to remove
 * @returns A new tree structure without the removed node
 */
export function removeNode<T>(
  node: OrgChartNode<T>,
  nodeIdToRemove: string | number
): OrgChartNode<T> | null {
  // Don't remove the root node
  if (node.id === nodeIdToRemove) {
    return null;
  }

  // Create a shallow copy
  const clonedNode: OrgChartNode<T> = {
    ...node,
    children: node.children ? [...node.children] : undefined,
  };

  if (!clonedNode.children) {
    return clonedNode;
  }

  // Filter out the node to remove and recursively process children
  const updatedChildren = clonedNode.children
    .filter(child => child.id !== nodeIdToRemove)
    .map(child => removeNode(child as OrgChartNode<T>, nodeIdToRemove))
    .filter((child): child is OrgChartNode<T> => child !== null);

  return {
    ...clonedNode,
    children: updatedChildren.length > 0 ? updatedChildren : undefined,
  };
}

/**
 * Adds a node as a child of the target parent node.
 * Returns a new tree structure with the node added.
 *
 * @param node - The root node to search in
 * @param targetParentId - The ID of the node that will become the parent
 * @param nodeToAdd - The node to add as a child
 * @returns A new tree structure with the node added
 */
export function addNodeToParent<T>(
  node: OrgChartNode<T>,
  targetParentId: string | number,
  nodeToAdd: OrgChartNode<T>
): OrgChartNode<T> | null {
  if (node.id === targetParentId) {
    // Found the target parent - add the node to its children
    const currentChildren = node.children || [];
    return {
      ...node,
      children: [...currentChildren, { ...nodeToAdd }],
    };
  }

  // Recursively search in children
  if (node.children) {
    const updatedChildren = node.children
      .map(child =>
        addNodeToParent(child as OrgChartNode<T>, targetParentId, nodeToAdd)
      )
      .filter((child): child is OrgChartNode<T> => child !== null);

    return {
      ...node,
      children: updatedChildren,
    };
  }

  return node;
}
