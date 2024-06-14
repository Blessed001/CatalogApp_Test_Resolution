
function makeExtensible<T>(obj: T): T {
  if (Object.isExtensible(obj)) {
    return obj;
  }
  return { ...obj };
}

export function makeTreeNodesExtensible<T extends { children?: T[] }>(nodes: T[]): T[] {
  return nodes.map(node => ({
    ...makeExtensible(node),
    children: node.children ? makeTreeNodesExtensible(node.children) : [],
  }));
}
