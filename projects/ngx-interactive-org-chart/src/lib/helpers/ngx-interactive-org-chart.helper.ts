import { OrgChartNode, OrgChartToggleNodeArgs } from '../models';

export function toggleNodeCollapse<T>({
  node,
  targetNode,
  collapse,
}: OrgChartToggleNodeArgs<T>): OrgChartNode<T> {
  if (node.id === targetNode) {
    const newCollapse = collapse ?? !node.collapsed;

    return {
      ...node,
      collapsed: newCollapse,
      children: node.children?.map(child =>
        setCollapseRecursively(child, newCollapse)
      ),
    };
  }

  if (node.children?.length) {
    return {
      ...node,
      children: node.children.map(child =>
        toggleNodeCollapse({ node: child, targetNode, collapse })
      ),
    };
  }

  return node;
}

function setCollapseRecursively<T>(
  node: OrgChartNode<T>,
  collapse: boolean
): OrgChartNode<T> {
  return {
    ...node,
    collapsed: collapse,
    children: node.children?.map(child =>
      setCollapseRecursively(child, collapse)
    ),
  };
}

export function mapNodesRecursively<T>(
  node: OrgChartNode<T>,
  collapsed?: boolean
): OrgChartNode<T> {
  const mappedChildren =
    node.children?.map(child =>
      mapNodesRecursively(child as OrgChartNode<T>, collapsed)
    ) || [];

  const descendantsCount = mappedChildren.reduce(
    (acc, child) => acc + 1 + (child.descendantsCount ?? 0),
    0
  );

  return {
    ...node,
    id: node.id ?? crypto.randomUUID(),
    collapsed: collapsed ?? node.collapsed ?? false,
    hidden: node.hidden ?? false,
    children: mappedChildren,
    descendantsCount,
  };
}
